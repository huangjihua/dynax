import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType } from "../../types";
import { stylelintignore, stylelint, scssRules } from './base'

export default function (targetDir: string, features: string[], isSass: boolean) {
  if (!features.includes(FeatureType.Stylelint)) return;
  if (isSass) {
    stylelint.extends = [...stylelint.extends, ...scssRules.extends]
    stylelint.rules = { ...stylelint.rules, ...scssRules.rules }
  }
  createOrOverwriteFile(`${targetDir}/.stylelintrc.js`, `module.exports = ${JSON.stringify(stylelint, null, 2).replace(/"(?!.*\/)(?!.*-)([^"]+)":/g, '$1:')}`)
  createOrOverwriteFile(`${targetDir}/.stylelintignore`, stylelintignore)
  // stylelint 15版本开始，stylelint-config-prettier已被弃用
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    "scripts": {
      "stylelint": "stylelint --fix src/**/*.{css,scss,less}"
    },
    "devDependencies": {
      "stylelint": "^16.6.1",
      "stylelint-order": "^6.0.4",
      "stylelint-config-standard": "^36.0.0",
    }
  })
}
