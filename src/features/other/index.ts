import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
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
 * @returns 无返回值
 */
export default function initOtherConfigFile(targetDir: string) {
  createOrOverwriteFile(`${targetDir}/.gitignore`, gitignore)
  createOrOverwriteFile(`${targetDir}/.npmrc`, `registry="https://registry.npmmirror.com"`)
  createOrOverwriteFile(`${targetDir}/.nvmrc`, `18.12.0`)
  createOrOverwriteFile(`${targetDir}/postcss.config.js`, `module.exports = {
  plugins: {
    autoprefixer: {},
  },
};`)
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    devDependencies: {
      autoprefixer: '10.4.19'
    }
  })
}