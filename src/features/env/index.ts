import { createOrOverwriteFile } from '../../utils/file'
import { CompileFrameWork } from "../../types";

function getConfig(compileFrameWork: CompileFrameWork) {
  switch (compileFrameWork) {
    case CompileFrameWork.webpack:
      return ''
      break;
    case CompileFrameWork.metro:
      return ''
      break;
    default:
      return `// 开发或生产环境服务的公共基础路径
VITE_APP_BASE=/
// 接口URL配置
VITE_APP_API_DOMAIN_1=/api`
      break;
  }
}
/**
 * 添加环境变量文件
 *
 * @param targetDir 目标目录
 * @param compileFrameWork 编译框架 如：vite,webpack
 */
export default async function addEnv(targetDir: string, compileFrameWork: CompileFrameWork = CompileFrameWork.vite) {
  const envConfig = getConfig(compileFrameWork)
  await createOrOverwriteFile(`${targetDir}/env/.env.dev`, envConfig)
  await createOrOverwriteFile(`${targetDir}/env/.env.test`, envConfig.replace('/api', 'http://test.api.com'))
  await createOrOverwriteFile(`${targetDir}/env/.env.prod`, envConfig.replace('/api', 'http://prod.api.com'))
}