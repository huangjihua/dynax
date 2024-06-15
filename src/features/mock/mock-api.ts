import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'

/**
 * 添加 mock 接口
 *
 * @param targetDir 目标目录
 */
export default async function addMockApi(targetDir: string) {

  await createOrOverwriteFile(`${targetDir}/mock/index.js`, `
     export default [
      {
        url: '/api/helloworld',
        method: 'get',
        response: () => ({
          returncode: 0,
          message: '',
          result: 'Welcome to dynax !',
        }),
      },
    ];
  `)

}