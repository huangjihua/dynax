import { pathExists, outputFile, readJson, outputJson, readFile, writeJson } from 'fs-extra';
import { merge } from 'lodash'
import spinner from '../helpers/spinner'
import { GenericObject } from "../types";

/**
 * 深度更新 JSON 文件中的指定字段
 * @param {string} filePath - JSON 文件的路径
 * @param {Object} updates - 包含要更新字段的对象
 */
const deepUpdateJson = async (filePath: string, updates: GenericObject) => {
  try {
    // 读取 JSON 文件
    const json = await readJson(filePath);
    // 深度合并更新
    const updatedJson = merge({}, json, updates);
    // 写回 JSON 文件
    await writeJson(filePath, updatedJson, { spaces: 2, encoding: 'utf8' });
  } catch (error: any) {
    console.error(`Error updating:`, error);
  }
};

/**
 * 创建文件，如果文件已存在则不处理，目录不存在会自动创建父级目录
 *
 * @export
 * @param {string} filePath
 * @param {*} context
 */
export async function createFile(filePath: string, context: any) {
  try {
    const flag = await pathExists(filePath)
    if (!flag) {
      if (typeof context !== 'string') {
        context = JSON.stringify(context, null, 2)
      }
      await outputFile(filePath, context, { encoding: 'utf8' });
      // spinner.succeed(`Successfully created ${filePath}`
      return true
    }
    return false
  } catch (error: any) {
    spinner.fail(`create Failed: ${error.message}`);
    return false
  }
}
/**
 * 创建或更新JSON配置文件
 *
 * @param {string}filePath 配置文件路径
 * @param {{ [keyPath: string]: any }} updates 更新属性值的键值对对象，键为属性路径，值为新属性值 ，比如：{
    'a.b.c': 42,
    'a.x.y.z': 200,
  });
 */

export async function createOrUpdateJsonConfigFile(filePath: string, updates: GenericObject) {
  try {
    const isCreated = await createFile(filePath, updates) // 新生成就不更新
    if (isCreated) return;
    await deepUpdateJson(filePath, updates)
    // spinner.succeed(`Successfully updated ${filePath}`);
  } catch (error: any) {
    spinner.fail(`json update Failed: ${error.message}`);
    process.exit(0);
  }
}

/**
 *  创建或更新文件
 *
 * @export
 * @param {string} filePath
 * @param {string} content
 */
export async function createOrOverwriteFile(filePath: string, content: string) {
  try {
    const isCreated = await createFile(filePath, content)
    if (isCreated) return;
    await outputFile(filePath, content, { encoding: 'utf8' });
    // spinner.succeed(`Successfully updated ${filePath}`);
  } catch (error: any) {
    spinner.fail(`file update Failed: ${error.message}`);
    process.exit(0);
  }
}
