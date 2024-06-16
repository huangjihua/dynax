import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
const execa = require('execa');

export default async function installHusky(targetDir: string) {
  await execa.command('git init', { cwd: targetDir })
  await execa.command('npx husky install', { cwd: targetDir })
  await createOrOverwriteFile(`${targetDir}/.husky/pre-commit`, `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx --no-install lint-staged`)
  await createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    devDependencies: {
      "husky": "^9.0.11",
      "lint-staged": "^15.2.7"
    }
  })
}