import { FeatureType } from "../../types";
import { createOrOverwriteFile } from '../../utils/file'

/**
 * 添加Prettier配置文件到指定目录
 *
 * @param targetDir 目标目录
 * @param features 功能列表
 * @returns 无返回值
 */
export default function addPrettier(targetDir: string, features: string[]) {
  if (!features.includes(FeatureType.Prettier)) return;
  createOrOverwriteFile(`${targetDir}/.prettierrc.js`, `module.exports = ${JSON.stringify({
    tabWidth: 2,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
    proseWrap: 'never',
    overrides: [
      {
        files: '*.md',
        options: {
          proseWrap: 'preserve',
        },
      },
    ],
  }, null, 2).replace(/"(?!.*\/)(?!.*-)([^"]+)":/g, '$1:')}`)
}