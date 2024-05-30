import logger from "../helpers/logger";

/**
 * 执行动作
 *
 * @returns 无返回值
 */
const action = () => {
  logger.info('你可以通过以下方式找到我😊：')
  logger.info('email: huangjihua.online@gmail.com');
};
export default {
  command: "contact",
  description: "获取作者的联系方式",
  action,
};