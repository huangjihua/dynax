import { createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType } from "../../types";

/**
 * 添加Sass功能到目标目录
 *
 * @param targetDir 目标目录路径
 * @param features 功能列表
 * @returns 添加成功返回true，否则返回false
 */
export default function addSass(targetDir: string, features: string[]) {
  const stylelint = features.includes(FeatureType.Stylelint) ? { "stylelint-config-standard-scss": "^13.1.0" } : {}
  try {
    createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
      devDependencies: {
        'sass': '^1.77.3',
        ...stylelint
      }
    })
    return true
  } catch (error) {
    return false
  }
}