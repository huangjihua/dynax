import { createOrOverwriteFile } from '../../utils/file'
const execa = require('execa');

export default function installHusky(targetDir: string) {
  execa.commandSync('pnpm add husky -D', {
    cwd: targetDir
  });
  execa.commandSync('pnpm husky init', {
    cwd: targetDir
  })
  createOrOverwriteFile(`${targetDir}/.husky/pre-commit`, `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx --no-install lint-staged`)
}