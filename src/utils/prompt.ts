import { existsSync, removeSync } from 'fs-extra'
import { input, confirm, checkbox, select } from '@inquirer/prompts';
import { FrameworkType, FeatureType, IQuestion } from "../types";

/**
 * 检查项目是否存在
 *
 * @param targetDir 目标文件夹路径
 * @returns 如果目标文件夹已存在且用户选择覆盖原路径，则返回false；如果目标文件夹不存在或用户选择取消创建，则返回true
 */
export const checkProjectExist = async (targetDir: string) => {
  if (existsSync(targetDir)) {
    const answer = await confirm({
      message: `仓库路径${targetDir}已存在同名目录，是否删除后新建？`,
      transformer: (value: boolean) => {
        if (value) {
          removeSync(targetDir);
          return '已删除'
        } else {
          return "已取消"
        }
      },
    });
    return answer;
  }
  return true;
};

/**
 * 获取问题列表中用户输入答案
 *
 * @param projectName 项目名称
 * @returns 返回问题列表的 Promise 对象
 */
export const getQuestions = async (projectName: string): Promise<IQuestion> => {
  const name = await input({
    message: `package name: (${projectName})`,
    default: projectName,
  });
  const description = await input({
    message: "description",
    default: `Init ${projectName}`
  });
  const author = await input({
    message: "author",
    default: ""
  });
  return { name, description, author }
};

/**
 *  选择构建框架
 *
 * @returns {Promise<{ template: FrameworkType }>}
 */
export const getSelectFramework = async (): Promise<{ template: FrameworkType }> => {
  const choices: { name: string, value: string }[] = Object.entries(FrameworkType).map(([key, value]) => ({ name: key, value }))
  console.log(choices)
  const answer = await select(
    {
      message: 'select framework',
      choices: choices
    }
  )
  return { template: answer as FrameworkType }
}

/**
 * 获取可选功能列表
 *
 * @returns 返回Promise对象，解析为用户选择的可选功能列表
 */
export const getOptionalFeatures = async (): Promise<{ features: string[] }> => {
  const choices = Object.entries(FeatureType).map(([name, value]) => ({
    name,
    value
  }));
  const answer = await checkbox(
    {
      message: "Select Optional Features",
      choices
    }
  )
  return { features: answer }
}