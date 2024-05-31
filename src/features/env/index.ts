import { createOrOverwriteFile } from '../../utils/file'
import { CompileFrameWork } from "../../types";

const envConfig = `//base: 开发或生产环境服务的公共基础路径
VITE_APP_BASE=/
// 接口域名配置
VITE_APP_API_DOMAIN_1=/api`

/**
 * 添加环境变量文件
 *
 * @param targetDir 目标目录
 * @param compileFrameWork 编译框架 如：vite,webpack
 */
export default function addEnv(targetDir: string, compileFrameWork: CompileFrameWork = CompileFrameWork.vite) {
  createOrOverwriteFile(`${targetDir}/env/.env.dev`, envConfig)
  createOrOverwriteFile(`${targetDir}/env/.env.test`, envConfig.replace('/api', 'http://test.api.com'))
  createOrOverwriteFile(`${targetDir}/env/.env.prod`, envConfig.replace('/api', 'http://prod.api.com'))
}