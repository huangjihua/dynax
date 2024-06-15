import { pathExists, outputFile, readJson, outputJson, readFile } from 'fs-extra';
import spinner from '../helpers/spinner'
import { flattenObject, updateNestedValues } from '../utils/obj';
import { GenericObject } from "../types";

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
  } catch (error) {
    spinner.fail(`create Failed: ${error}`);
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
    let fileJson = await readJson(filePath, { encoding: 'utf8' });
    const newFileData = updateNestedValues(fileJson, flattenObject(updates))
    await outputJson(filePath, newFileData, { spaces: 2, encoding: 'utf8' });
    // spinner.succeed(`Successfully updated ${filePath}`);
  } catch (error) {
    spinner.fail(`json update Failed: ${error}`);
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
  } catch (error) {
    spinner.fail(`file update Failed: ${error}`);
    process.exit(0);
  }
}
