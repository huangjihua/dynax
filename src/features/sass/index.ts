import { createOrUpdateJsonConfigFile } from '../../utils/file'

export default function addSass(targetDir: string) {
  try {
    createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
      devDependencies: {
        'sass': '^1.77.3',
        "stylelint-config-standard-scss": "^13.1.0"
      }
    })
    return true
  } catch (error) {
    return false
  }
}