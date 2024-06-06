import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType, FrameworkType } from "../../types";
import { stylelintignore, stylelint, nativeLint, scssRules } from './base'

export default function (targetDir: string, template: FrameworkType, features: string[], isSass: boolean) {
  if (!features.includes(FeatureType.Stylelint)) return;
  const isNative = template === FrameworkType.reactNative
  let devDependencies = {}

  if (isNative) {
    devDependencies = {
      "stylelint": "^16.6.1",
      "stylelint-react-native": "2.7.0"
    }
  } else {
    devDependencies = {
      "stylelint": "^16.6.1",
      "stylelint-order": "^6.0.4",
      "stylelint-config-standard": "^36.0.0"
    }
  }
  if (isSass) {
    stylelint.extends = [...stylelint.extends, ...scssRules.extends]
    stylelint.rules = { ...stylelint.rules, ...scssRules.rules }
  }
  createOrOverwriteFile(`${targetDir}/.stylelintrc.js`, `module.exports = ${JSON.stringify(isNative ? nativeLint : stylelint, null, 2).replace(/"(?!.*\/)(?!.*-)([^"]+)":/g, '$1:')}`)
  createOrOverwriteFile(`${targetDir}/.stylelintignore`, stylelintignore)
  // stylelint 15版本开始，stylelint-config-prettier已被弃用
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    "scripts": {
      "stylelint": "stylelint --fix src/**/*.{css,scss,less}"
    },
    "devDependencies": {
      ...devDependencies
    }
  })
}
