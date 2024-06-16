import * as globby from 'globby'
import * as path from 'path'
import { readFileSync, readJson } from 'fs-extra';
import { manifest } from 'pacote'
import { program } from "commander";
import logger from "../helpers/logger";

export interface IPackageInfo {
  version: string;
  name: string;
  engines: {
    node: string
  }
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

/**
 * 检查当前 Node.js 版本是否满足指定版本要求
 *
 * @param engines 包含 node 字段的对象，表示所需 Node.js 版本范围
 * @returns 无返回值 不符合版本退出程序
 */
export const checkNodeVersion = (engines: { node: string }) => {
  const semver = require('semver')
  if (!semver.satisfies(process.version, engines.node)) {
    console.error(
      `Required node version ${engines.node} not satisfied with current version ${process.version}.`
    );
    process.exit(1);
  }
}