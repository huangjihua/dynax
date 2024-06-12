import * as globby from 'globby'
import * as path from 'path' // 这引入方式有毒
import { readFileSync } from 'fs-extra';
import { manifest } from 'pacote'
import logger from "../helpers/logger";
export interface IPackageInfo {
  version: string;
  name: string;
}


/**
 * 获取某个路径下的所有文件路径
 *
 * @param pathName 路径名
 * @returns 返回字符串数组，包含匹配到的路径列表
 */
export const getPathList = (pathName: string): string[] => {
  let PathList: string[] = [];
  try {
    PathList = globby.sync(pathName, { cwd: path.resolve(__dirname, '..'), deep: 1 }) || [];
  } catch (error: any) {
    logger.error(error);
  }
  return PathList;
};

/**
 * 获取项目package.json文件中的信息
 *
 * @returns 返回IPackageInfo接口对象，包含package.json中的信息
 */
export const getPkgInfo = (): IPackageInfo => {
  const jsonPath = path.join(__dirname, '../../package.json')
  const jsonContent = readFileSync(jsonPath, { encoding: 'utf-8' })
  const jsonResult = JSON.parse(jsonContent)
  return jsonResult as IPackageInfo;
}

/**
 * 获取指定包的最新版本号
 *
 * @param pkgName 包名
 * @returns 最新版本号
 */
export const getLatestVersion = async (pkgName: string) => {
  const _manifest = await manifest(`${pkgName}@latest`)
  return _manifest.version
}

/**
 * 设置git信息
 *
 * @param git git仓库地址
 * @returns 返回包含git初始化、分支设置、远程仓库设置的字符串数组
 */
export const setGit = (git: string): string[] => [
  "git init",
  "git branch -M master",
  `git remote add origin ${git}`,
];