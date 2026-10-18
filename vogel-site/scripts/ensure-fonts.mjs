// Chillax's ITF Free Font License forbids redistribution, so it is never committed (see docs/manual, section 7).
// The repo's script downloads it from Fontshare; this copies it next to the React site's public files.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'

execFileSync(process.execPath, ['../scripts/ensure-fontshare-fonts.mjs'], { stdio: 'inherit' })
fs.mkdirSync('public/fonts', { recursive: true })
fs.copyFileSync('../public/fonts/chillax-variable.woff2', 'public/fonts/chillax-variable.woff2')
