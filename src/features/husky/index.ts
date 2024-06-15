import { createOrOverwriteFile } from '../../utils/file'
const execa = require('execa');

export default async function installHusky(targetDir: string) {
  await execa.command('pnpm add husky -D', {
    cwd: targetDir
  });
  await execa.command('pnpm husky init', {
    cwd: targetDir
  })
  await createOrOverwriteFile(`${targetDir}/.husky/pre-commit`, `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx --no-install lint-staged`)
}