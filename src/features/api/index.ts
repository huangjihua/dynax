import { createOrOverwriteFile } from '../../utils/file'
import { FeatureType, CompileFrameWork } from "../../types";


const apiConfig = `const apiDomain = {
  API_1: '/api',
};

try {
  switch (import.meta.env.mode) {
    case 'test':
      apiDomain.API_1 = 'http://test.com';
      break;
    case 'prod':
      apiDomain.API_1 = 'http://prod.com';
      break;
    default:
      apiDomain.API_1 = '/api';
      break;
  }
} catch (error) {
  console.error(error);
}

export default {
  helloworld: apiDomain.API_1 + '/helloworld',
};`
/**
 * 添加 API 接口， 统一输出入口
 *
 * @param targetDir 目标目录
 * @param features 功能列表
 * @returns 无返回值
 */
export default function addApi(targetDir: string, features: string[], compileFrameWork: CompileFrameWork) {
  const isTs = features.includes(FeatureType.TypeScript);
  const ext = isTs ? 'ts' : 'js';
  createOrOverwriteFile(`${targetDir}/src/api/config.${ext}`, apiConfig)
  createOrOverwriteFile(`${targetDir}/src/api/index.${ext}`, `import apiUrl from '@/api/config';
export async function getHelloworld() {
  return (await fetch(apiUrl.helloworld)).json();
}`)
}