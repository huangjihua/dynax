
import * as path from 'path'
import {
  pathExistsSync, outputFileSync, readJsonSync, outputJsonSync, readdirSync, readFileSync, copyFileSync
} from 'fs-extra';
import logger from "../helpers/logger";
import { convertToNestedObject, flattenObject, updateNestedValues } from '../utils/obj';
import { GenericObject } from "../types";

/**
 * 创建文件，如果文件已存在则不处理，目录不存在会自动创建父级目录
 *
 * @export
 * @param {string} filePath
 * @param {*} context
 */
export function createFile(filePath: string, context: any) {
  if (!pathExistsSync(filePath)) {
    if (typeof context !== 'string') {
      context = JSON.stringify(context, null, 2)
    }
    outputFileSync(filePath, context, { encoding: 'utf8' });
    console.log(`Successfully created ${filePath} file.`);
    return true;
  }
  return false

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

export function createOrUpdateJsonConfigFile(filePath: string, updates: GenericObject) {
  try {
    const isCreated = createFile(filePath, updates)
    if (isCreated) return;
    let fileJson = readJsonSync(filePath, { encoding: 'utf8' });
    // console.log('fileData:', fileJson)
    const newFileData = updateNestedValues(fileJson, flattenObject(updates))
    // console.log('newFileData:', newFileData)
    outputJsonSync(filePath, newFileData, { spaces: 2, encoding: 'utf8' });
    console.log(`Successfully update ${filePath} file`);
  } catch (error) {
    console.error(`${filePath} update error: ${error}`);
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
export function createOrOverwriteFile(filePath: string, content: string) {
  try {
    const isCreated = createFile(filePath, content)
    if (isCreated) return;
    outputFileSync(filePath, content, { encoding: 'utf8' });
    console.log(`Successfully update ${filePath} file`);
  } catch (error) {
    console.error(`${filePath} update error: ${error}`);
    process.exit(0);
  }
}
