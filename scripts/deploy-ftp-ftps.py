#!/usr/bin/env python3
"""Upload a static build over explicit FTPS and verify every remote file size."""

import argparse
import ftplib
import ssl
import time
from pathlib import Path


def read_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip("\"'")
    return values


def connect(values: dict[str, str], context: ssl.SSLContext, remote_root: str) -> ftplib.FTP_TLS:
    ftp = ftplib.FTP_TLS(context=context, timeout=45)
    ftp.connect(values["FTP_HOST"], int(values.get("FTP_PORT", "21")))
    ftp.login(values["FTP_USER"], values["FTP_PASSWORD"])
    ftp.prot_p()
    ftp.cwd("/" + remote_root if remote_root else "/")
    return ftp


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env", required=True, type=Path, help="FTP settings file")
    parser.add_argument("--source", required=True, type=Path, help="Static build directory")
    args = parser.parse_args()

    values = read_env(args.env)
    for key in ("FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_REMOTE_DIR"):
        if not values.get(key):
            raise ValueError(f"Missing {key} in FTP settings")

    context = (
        ssl._create_unverified_context()
        if values.get("FTP_INSECURE", "false").lower() == "true"
        else ssl.create_default_context()
    )
    source = args.source.resolve()
    remote_root = values.get("FTP_REMOTE_DIR", "/").strip("/")
    files = [path for path in source.rglob("*") if path.is_file()]
    files.sort(key=lambda path: (path.suffix.lower() == ".html", path.as_posix().lower()))

    ftp = connect(values, context, remote_root)
    try:
        for index, local in enumerate(files, 1):
            relative = local.relative_to(source).as_posix()
            parts = relative.split("/")
            try:
                for directory in parts[:-1]:
                    try:
                        ftp.cwd(directory)
                    except ftplib.error_perm:
                        ftp.mkd(directory)
                        ftp.cwd(directory)

                for attempt in range(2):
                    try:
                        with local.open("rb") as stream:
                            ftp.storbinary("STOR " + parts[-1], stream, blocksize=65536)
                        remote_size = ftp.size(parts[-1])
                        local_size = local.stat().st_size
                        if remote_size != local_size:
                            raise IOError(f"size mismatch: {remote_size} != {local_size}")
                        break
                    except Exception:
                        if attempt:
                            raise
                        try:
                            ftp.quit()
                        except Exception:
                            pass
                        time.sleep(1)
                        ftp = connect(values, context, remote_root)
                        for directory in parts[:-1]:
                            ftp.cwd(directory)

                print(f"[{index}/{len(files)}] verified {relative}", flush=True)
            finally:
                try:
                    ftp.cwd("/" + remote_root if remote_root else "/")
                except Exception:
                    pass
    finally:
        try:
            ftp.quit()
        except Exception:
            pass

    print(f"DEPLOY_COMPLETE files={len(files)}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
