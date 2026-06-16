param(
  [string]$EnvFile = ".env.deploy-ftp.local",
  [switch]$Execute,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

function Read-EnvFile {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "No existe el archivo de configuracion: $Path"
  }

  $values = @{}

  foreach ($line in Get-Content -LiteralPath $Path) {
    $trimmed = $line.Trim()

    if (-not $trimmed -or $trimmed.StartsWith("#")) {
      continue
    }

    $separatorIndex = $trimmed.IndexOf("=")

    if ($separatorIndex -le 0) {
      continue
    }

    $key = $trimmed.Substring(0, $separatorIndex).Trim()
    $value = $trimmed.Substring($separatorIndex + 1).Trim()

    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    $values[$key] = $value
  }

  return $values
}

function Require-Value {
  param(
    [hashtable]$Values,
    [string]$Key
  )

  if (-not $Values.ContainsKey($Key) -or [string]::IsNullOrWhiteSpace($Values[$Key])) {
    throw "Falta completar $Key en el archivo de configuracion."
  }

  return $Values[$Key]
}

function Convert-ToRemoteUrl {
  param(
    [string]$Protocol,
    [string]$HostName,
    [string]$Port,
    [string]$RemoteDir,
    [string]$RelativePath
  )

  $hostPart = $HostName
  if (-not [string]::IsNullOrWhiteSpace($Port)) {
    $hostPart = "${HostName}:$Port"
  }

  $normalizedRelativePath = $RelativePath.Replace("\", "/").TrimStart("/")
  $normalizedRemoteDir = $RemoteDir.Trim("/")

  if ([string]::IsNullOrWhiteSpace($normalizedRemoteDir)) {
    $fullPath = $normalizedRelativePath
  } else {
    $fullPath = @($normalizedRemoteDir, $normalizedRelativePath) -join "/"
  }

  $encodedPath = (($fullPath -split "/") | ForEach-Object { [Uri]::EscapeDataString($_) }) -join "/"

  return "${Protocol}://${hostPart}/${encodedPath}"
}

function Get-RelativeFilePath {
  param(
    [string]$BasePath,
    [string]$FilePath
  )

  $normalizedBase = (Resolve-Path -LiteralPath $BasePath).ProviderPath.TrimEnd("\", "/") + [System.IO.Path]::DirectorySeparatorChar
  $normalizedFile = (Resolve-Path -LiteralPath $FilePath).ProviderPath

  if (-not $normalizedFile.StartsWith($normalizedBase, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "El archivo no esta dentro de la carpeta de salida: $FilePath"
  }

  return $normalizedFile.Substring($normalizedBase.Length)
}

function New-CurlArgs {
  param(
    [string]$CurlConfigPath,
    [hashtable]$Config
  )

  $curlArgs = @("--fail", "--show-error", "--silent", "--config", $CurlConfigPath)

  if ($Config["FTP_SSL_REQD"] -eq "true") {
    $curlArgs += "--ssl-reqd"
  }

  if ($Config["FTP_INSECURE"] -eq "true") {
    $curlArgs += "--insecure"
  }

  return $curlArgs
}

function Download-RemoteFile {
  param(
    [string]$Curl,
    [string]$CurlConfigPath,
    [hashtable]$Config,
    [string]$Url,
    [string]$OutputPath
  )

  $curlArgs = New-CurlArgs -CurlConfigPath $CurlConfigPath -Config $Config
  $curlArgs += @("--output", $OutputPath, $Url)

  & $Curl @curlArgs

  if ($LASTEXITCODE -ne 0) {
    throw "No se pudo verificar el archivo remoto: $Url"
  }
}

function Assert-RemoteFileSize {
  param(
    [string]$Curl,
    [string]$CurlConfigPath,
    [hashtable]$Config,
    [string]$Url,
    [string]$LocalPath,
    [string]$RelativePath
  )

  $tempDownload = New-TemporaryFile

  try {
    Download-RemoteFile -Curl $Curl -CurlConfigPath $CurlConfigPath -Config $Config -Url $Url -OutputPath $tempDownload.FullName

    $localSize = (Get-Item -LiteralPath $LocalPath).Length
    $remoteSize = (Get-Item -LiteralPath $tempDownload.FullName).Length

    if ($remoteSize -ne $localSize) {
      throw "Verificacion fallida para ${RelativePath}: remoto=${remoteSize} bytes, local=${localSize} bytes"
    }
  } finally {
    Remove-Item -LiteralPath $tempDownload.FullName -Force -ErrorAction SilentlyContinue
  }
}

function Upload-FileOnce {
  param(
    [string]$Curl,
    [string]$CurlConfigPath,
    [hashtable]$Config,
    [string]$LocalPath,
    [string]$Url
  )

  $curlArgs = New-CurlArgs -CurlConfigPath $CurlConfigPath -Config $Config
  $curlArgs += @("--upload-file", $LocalPath, $Url)

  & $Curl @curlArgs

  return $LASTEXITCODE
}

function Upload-FileChunked {
  param(
    [string]$Curl,
    [string]$CurlConfigPath,
    [hashtable]$Config,
    [string]$LocalPath,
    [string]$Url,
    [string]$RelativePath
  )

  $bytes = [System.IO.File]::ReadAllBytes($LocalPath)
  $chunkSize = 4096
  $chunkCount = [Math]::Ceiling($bytes.Length / $chunkSize)
  $chunkDir = Join-Path ([System.IO.Path]::GetTempPath()) ("vogel-upload-" + [guid]::NewGuid().ToString("N"))

  New-Item -ItemType Directory -Path $chunkDir | Out-Null

  try {
    for ($i = 0; $i -lt $chunkCount; $i++) {
      $offset = $i * $chunkSize
      $length = [Math]::Min($chunkSize, $bytes.Length - $offset)
      $chunk = New-Object byte[] $length

      [Array]::Copy($bytes, $offset, $chunk, 0, $length)

      $chunkPath = Join-Path $chunkDir ("chunk-$i.bin")
      [System.IO.File]::WriteAllBytes($chunkPath, $chunk)

      Write-Host "  Reintento por partes $($i + 1)/$chunkCount"

      $curlArgs = New-CurlArgs -CurlConfigPath $CurlConfigPath -Config $Config

      if ($i -gt 0) {
        $curlArgs += "--append"
      }

      $curlArgs += @("--upload-file", $chunkPath, $Url)

      & $Curl @curlArgs

      if ($LASTEXITCODE -ne 0) {
        throw "Fallo la subida por partes de $RelativePath"
      }
    }
  } finally {
    Remove-Item -LiteralPath $chunkDir -Recurse -Force -ErrorAction SilentlyContinue
  }
}

function Upload-And-VerifyFile {
  param(
    [string]$Curl,
    [string]$CurlConfigPath,
    [hashtable]$Config,
    [string]$LocalPath,
    [string]$Url,
    [string]$RelativePath
  )

  $exitCode = Upload-FileOnce -Curl $Curl -CurlConfigPath $CurlConfigPath -Config $Config -LocalPath $LocalPath -Url $Url

  if ($exitCode -ne 0) {
    Write-Host "  Subida directa fallo. Reintentando por partes..."
    Upload-FileChunked -Curl $Curl -CurlConfigPath $CurlConfigPath -Config $Config -LocalPath $LocalPath -Url $Url -RelativePath $RelativePath
  }

  try {
    Assert-RemoteFileSize -Curl $Curl -CurlConfigPath $CurlConfigPath -Config $Config -Url $Url -LocalPath $LocalPath -RelativePath $RelativePath
  } catch {
    Write-Host "  $($_.Exception.Message)"
    Write-Host "  Reintentando por partes y verificando otra vez..."
    Upload-FileChunked -Curl $Curl -CurlConfigPath $CurlConfigPath -Config $Config -LocalPath $LocalPath -Url $Url -RelativePath $RelativePath
    Assert-RemoteFileSize -Curl $Curl -CurlConfigPath $CurlConfigPath -Config $Config -Url $Url -LocalPath $LocalPath -RelativePath $RelativePath
  }
}

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$resolvedEnvFile = Join-Path $projectRoot $EnvFile
$config = Read-EnvFile -Path $resolvedEnvFile

$protocol = $config["FTP_PROTOCOL"]
if ([string]::IsNullOrWhiteSpace($protocol)) {
  $protocol = "ftp"
}
$protocol = $protocol.ToLowerInvariant()

if (@("ftp", "ftps", "sftp") -notcontains $protocol) {
  throw "FTP_PROTOCOL debe ser ftp, ftps o sftp."
}

$hostName = Require-Value -Values $config -Key "FTP_HOST"
$user = Require-Value -Values $config -Key "FTP_USER"
$password = Require-Value -Values $config -Key "FTP_PASSWORD"
$remoteDir = Require-Value -Values $config -Key "FTP_REMOTE_DIR"
$port = $config["FTP_PORT"]
$outputDir = $config["BUILD_OUTPUT"]
if ([string]::IsNullOrWhiteSpace($outputDir)) {
  $outputDir = "dist"
}

$outputPath = Join-Path $projectRoot $outputDir

Write-Host "==> Deploy FTP Vogel"
Write-Host "Proyecto: $projectRoot"
Write-Host "Salida: $outputPath"
Write-Host "Destino: ${protocol}://${hostName}/$remoteDir"

if (-not $SkipBuild) {
  Write-Host ""
  Write-Host "==> Build"
  Push-Location $projectRoot
  try {
    npm run build
  } finally {
    Pop-Location
  }
}

if (-not (Test-Path -LiteralPath $outputPath)) {
  throw "No existe la carpeta de salida: $outputPath"
}

$files = Get-ChildItem -LiteralPath $outputPath -Recurse -File | Sort-Object `
  @{ Expression = { if ($_.Extension -eq ".html") { 1 } else { 0 } } }, `
  FullName

Write-Host ""
Write-Host "==> Resumen"
Write-Host "Archivos a subir: $($files.Count)"
Write-Host "Orden seguro: assets primero, HTML al final"

if (-not $Execute) {
  Write-Host "Modo dry-run. Agrega -Execute para copiar a produccion."
  exit 0
}

$curl = (Get-Command curl.exe -ErrorAction Stop).Source
$tempCurlConfig = New-TemporaryFile

try {
  $curlConfigLines = @(
    "user = `"$user`:$password`"",
    "ftp-create-dirs"
  )

  Set-Content -LiteralPath $tempCurlConfig -Value $curlConfigLines -Encoding ASCII

  foreach ($file in $files) {
    $relativePath = Get-RelativeFilePath -BasePath $outputPath -FilePath $file.FullName
    $url = Convert-ToRemoteUrl -Protocol $protocol -HostName $hostName -Port $port -RemoteDir $remoteDir -RelativePath $relativePath

    Write-Host "Subiendo $relativePath"
    Upload-And-VerifyFile -Curl $curl -CurlConfigPath $tempCurlConfig.FullName -Config $config -LocalPath $file.FullName -Url $url -RelativePath $relativePath
  }
} finally {
  Remove-Item -LiteralPath $tempCurlConfig -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "==> Deploy completado"
