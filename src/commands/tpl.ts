import logger from "../helpers/logger";
import { FrameworkType } from "../types";
/**
 * 执行动作
 *
 * @returns 无返回值
 */
const action = () => {
  logger.info('查看默认支持的Framework Template')
  logger.info(Object.keys(FrameworkType).join('\n'));
};
export default {
  command: "tpl",
  description: " 查看默认支持的Framework Template",
  action,
};