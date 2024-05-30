import { GenericObject } from "../types";


/**
 * 更新嵌套对象的属性值
 *
 * @param {GenericObject} obj 待更新的嵌套对象
 * @param {{ [keyPath: string]: any }} updates 更新属性值的键值对对象，键为属性路径，值为新属性值 ，比如：{
    'a.b.c': 42,
    'a.x.y.z': 200,
  });
 * @returns {GenericObject}  更新后的嵌套对象
 */
export const updateNestedValues = (obj: GenericObject, updates: { [keyPath: string]: any }): GenericObject => {
  const result = { ...obj };
  for (const keyPath in updates) {
    const keys = keyPath.split('.');
    let current: GenericObject = result;

    keys.slice(0, -1).forEach(key => {
      current[key] = current[key] || {};
      current = current[key];
    });

    current[keys[keys.length - 1]] = updates[keyPath];
  }

  return result;
}

/**
 * 将嵌套对象扁平化为一个一维对象
 *
 * @param obj 要扁平化的嵌套对象
 * @param parentKey 当前对象的父级键名，默认为空字符串
 * @param result 存储扁平化结果的对象，默认为空对象
 * @returns 扁平化后的一维对象
 */
export const flattenObject = (obj: GenericObject, parentKey: string = '', result: GenericObject = {}): GenericObject => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}


/**
 * 将扁平对象转换为嵌套对象
 *
 * @param flatObject 扁平对象，键为字符串类型，值为任意类型
 * @returns 嵌套对象，类型为GenericObject
 */
export const convertToNestedObject = (flatObject: { [keyPath: string]: any }): GenericObject => {
  const nestedObject: GenericObject = {};

  Object.keys(flatObject).forEach(keyPath => {
    const value = flatObject[keyPath];
    const keys = keyPath.split('.');

    let current = nestedObject;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!(key in current)) {
          current[key] = {};
        }
        current = current[key];
      }
    });
  });

  return nestedObject;
}