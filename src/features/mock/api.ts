import { createOrOverwriteFile } from '../../utils/file'
import { FeatureType, FrameworkType } from "../../types";

/**
 * 添加 API 接口， 统一输出入口
 *
 * @param targetDir 目标目录
 * @param features 功能列表
 * @returns 无返回值
 */
export default function addApi(targetDir: string, features: string[],) {
  const isTs = features.includes(FeatureType.TypeScript);
  const ext = isTs ? 'ts' : 'js';
  createOrOverwriteFile(`${targetDir}/src/api/index.${ext}`, `
     export function getHelloworld() {
      return fetch('/helloworld')
     }
  `)
}