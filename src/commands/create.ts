import * as path from "path";
import { copySync } from 'fs-extra'
import * as chalk from "chalk";
import { getQuestions, getSelectFramework, getOptionalFeatures, checkProjectExist } from "../utils/prompt";
import { FrameworkType, ICmdArgs, CompileFrameWork } from "../types";
import { createOrUpdateJsonConfigFile } from "../utils/file";
import { addTsConfig, addEslint, addStylelint, addPrettier, addApi, addMock, initVite, initTpl, initApp, initOtherConfigFile, addSass, installHusky } from "../features";
import spinner from '../helpers/spinner'

/**
 * 生成特性文件
 *
 * @param projectName 项目名称
 * @param targetDir 目标目录
 * @param template 框架类型
 * @param features 特性数组
 * @returns 无返回值
 */
const generateFeatureFile = (projectName: string, targetDir: string, template: FrameworkType, features: string[]) => {
  const isNative = template === FrameworkType.reactNative
  addTsConfig(targetDir, template, features) // typescript
  addApi(targetDir, features, CompileFrameWork.vite)
  addMock(targetDir, features) // mock
  initVite(targetDir, template, features, CompileFrameWork.vite) // vite
  initTpl(targetDir, template, features, CompileFrameWork.vite) // tpl => html
  initApp(targetDir, template, projectName, features) // generate app
  initOtherConfigFile(targetDir, template)
  addEslint(targetDir, template, features) // eslint

  const isSass = isNative ? false : addSass(targetDir, features) // sass
  addStylelint(targetDir, template, features, isSass) // stylelint

  addPrettier(targetDir, features) // prettier
  installHusky(targetDir) // husky
}
/**
 * 创建一个新的项目
 *
 * @param projectName 项目名称
 * @param cmdArgs 命令行参数,  一个是command解析出的命令，一个是option中的选项
 * dynax create project --template template --context context 
 * projectName为project，cmdArgs为 { template: 'template', context: 'context' }
 * @returns 无返回值
 */
const action = async (projectName: string, cmdArgs?: ICmdArgs) => {
  try {

    // 目标路径
    const targetDir = path.join(
      (cmdArgs && cmdArgs.context) || process.cwd(),
      projectName
    );
    // 使用的模版
    let template = cmdArgs?.template;
    // 为主动设置 template 提供选择框架
    if (!template) {
      const framework = await getSelectFramework()
      template = framework.template
    }
    // 可选配置
    const { features } = await getOptionalFeatures();
    const flag = await checkProjectExist(targetDir)
    if (flag) {
      // 获取用户输入
      const projectInfo = await getQuestions(projectName)
      // spinner.start(`start create project: ${chalk.cyan(projectName)}`);
      spinner.loading(`Loading create project : ${chalk.cyan(projectName)}`)
      // 复制'template'到目标路径下创建工程
      copySync(path.join(__dirname, "..", "..", `template`), targetDir);
      // 重写文件内容
      createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
        ...projectInfo, ...{
          "private": true,
          "version": "0.0.0",
        }
      })
      generateFeatureFile(projectName, targetDir, template, features)

      spinner.succeed(`构建完成`);
      spinner.end(
        `🎉 项目创建成功 ${chalk.yellow(projectName)}\n\n👉 输入以下命令开始创作吧!:`
      );
      console.log(chalk.blue(`$ cd ${projectName}\n$ pnpm install\n$ pnpm dev\n`))
    }
  } catch (err: any) {
    console.error(`Action Failed : ${err.message}`)
    return;
  }
};

export default {
  command: "create <project-name>",
  description: "创建一个新的项目",
  optionList: [
    ["--context <context>", "上下文路径(新建文件路径)"],
    ["--template <template>", "选择哪个模版"],
  ],
  action,
};