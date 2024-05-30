import { existsSync, removeSync } from 'fs-extra'
import { FrameworkType, FeatureType, IQuestion } from "../types";
import logger from "../helpers/logger";

const inquirer = require('inquirer');

/**
 * 检查项目是否存在
 *
 * @param targetDir 目标文件夹路径
 * @returns 如果目标文件夹已存在且用户选择覆盖原路径，则返回false；如果目标文件夹不存在或用户选择取消创建，则返回true
 */
export const checkProjectExist = async (targetDir: string) => {
  if (existsSync(targetDir)) {
    const answer = await inquirer.prompt({
      type: "list",
      name: "checkExist",
      message: `\n仓库路径${targetDir}已存在同名文件，请选择是否需要覆盖原路径（删除原文件后新建）`,
      choices: ["是", "否"],
    });
    if (answer.checkExist === "是") {
      logger.warn(`已删除${targetDir}...`);
      removeSync(targetDir);
      return false;
    } else {
      logger.info("您已取消创建");
      return true;
    }
  }
  return false;
};

/**
 * 获取问题列表中用户输入答案
 *
 * @param projectName 项目名称
 * @returns 返回问题列表的 Promise 对象
 */
export const getQuestions = async (projectName: string): Promise<IQuestion> => {
  return await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: `package name: (${projectName})`,
      default: projectName,
    },
    {
      type: "input",
      name: "description",
      message: "description",
    },
    {
      type: "input",
      name: "author",
      message: "author",
    }
  ]);
};


/**
 *  选择构建框架
 *
 * @returns {Promise<{ template: FrameworkType }>}
 */
export const getSelectFramework = (): Promise<{ template: FrameworkType }> => {
  const choices = Object.values(FrameworkType)
  return inquirer.prompt([
    {
      type: "list",
      name: 'template',
      message: 'select framework',
      choices
    }
  ])
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
  return await inquirer.prompt(
    {
      type: "checkbox",
      name: "features",
      message: "Select Optional Features",
      choices
    }
  )
}