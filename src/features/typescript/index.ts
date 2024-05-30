
import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { GenericObject, FeatureType, FrameworkType } from "../../types";
import { tsConfigNode, tsConfig } from './base'

/**
 * 添加 ESLint 规则到项目中
 *
 * @param template 框架类型
 * @param feature 功能类型（可选）
 */


export default function addTsConfig(targetDir: string, template: FrameworkType, features: string[]) {
  if (!features.includes(FeatureType.TypeScript)) return;
  let config: GenericObject = tsConfig
  switch (template) {
    case FrameworkType.react:
      break;
    case FrameworkType.vue:
      config.compilerOptions.jsx = 'preserve'
      break;
    case FrameworkType.reactNative:
      break;
    default:
      break;
  }
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, { devDependencies: { typescript: '^5.4.5' } })
  createOrUpdateJsonConfigFile(`${targetDir}/tsconfig.json`, config)
  createOrUpdateJsonConfigFile(`${targetDir}/tsconfig.node.json`, tsConfigNode)
}
