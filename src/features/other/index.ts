import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FrameworkType } from "../../types";

const gitignore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`
/**
 * 初始化其他配置文件
 *
 * @param targetDir 目标目录
 * @param template 项目模板
 * @returns 无返回值
 */
export default async function initOtherConfigFile(targetDir: string, template: FrameworkType) {
  await createOrOverwriteFile(`${targetDir}/.gitignore`, gitignore)
  await createOrOverwriteFile(`${targetDir}/.npmrc`, `registry="https://registry.npmmirror.com"`)
  await createOrOverwriteFile(`${targetDir}/.nvmrc`, `18.0.0`)
  if (template !== FrameworkType.reactNative) {
    await createOrOverwriteFile(`${targetDir}/postcss.config.js`, `module.exports = {
  plugins: {
    autoprefixer: {}
  },
};`)
    await createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
      devDependencies: {
        autoprefixer: '10.4.19'
      }
    })
  }
}