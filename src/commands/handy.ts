import logger from "../helpers/logger";

const execa = require('execa');

/**
 * 执行动作
 *
 * @returns 无返回值
 */
const action = async (projectName: string) => {
  console.log("handy:", projectName);

  try {
    // 使用的模版
    if (projectName) {
      await execa.command(`npx @auto/handy create ${projectName}`, {
        stdio: "inherit",
      })
    } else {
      logger.error("请输入项目名称");
    }
  } catch (error:any) {
    logger.error(error);
  }
};
export default {
  command: "handy <project-name>",
  description: "构建 AutoHome 内部项目",
  action,
};