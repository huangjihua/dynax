import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FrameworkType } from "../../types";
import { stylelintignore, stylelint } from './base'

export default function (targetDir: string, template: FrameworkType, features: string[]) {

  createOrOverwriteFile(`${targetDir}/.stylelintignore`, stylelintignore)
  createOrOverwriteFile(`${targetDir}/.stylelintrc.js`, `module.exports = ${JSON.stringify(stylelint, null, 2).replace(/"(?!.*\/)(?!.*-)([^"]+)":/g, '$1:')}`)
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    "scripts": {
      "stylelint": "stylelint src/**/*.{css,scss,less}"
    },
    "devDependencies": {
      "stylelint": "^16.6.1",
      "stylelint-config-standard": "^36.0.0",
      "stylelint-config-prettier": "^9.0.5",
    }
  })
}
