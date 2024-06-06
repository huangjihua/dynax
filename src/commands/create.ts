import * as path from "path";
import { copySync } from 'fs-extra'
import * as chalk from "chalk";
import logger from "../helpers/logger";
import spinner from "../helpers/spinner";
import { getQuestions, getSelectFramework, getOptionalFeatures, checkProjectExist } from "../utils/prompt";
import { FrameworkType, IQuestion, ICmdArgs, CompileFrameWork } from "../types";
import { createOrUpdateJsonConfigFile } from "../utils/file";
import { addTsConfig, addEslint, addStylelint, addPrettier, addApi, addMock, initVite, initTpl, initApp, initOtherConfigFile, addSass, installHusky } from "../features";

const execa = require('execa');

/**
 * 生成 Git 初始化命令数组
 *
 * @param git 远程仓库地址
 * @returns Git 初始化命令数组
 */
const gitCmds = (git: string): string[] => [
  "git init",
  "git branch -M master",
  `git remote add origin ${git}`,
];

/**
 * 克隆项目
 *
 * @param targetDir 目标目录
 * @param projectName 项目名称
 * @param template 项目模板
 * @param projectInfo 项目信息
 * @returns 无返回值
 */
export const cloneProject = (
  targetDir: string,
  projectName: string,
  template: FrameworkType,
  projectInfo: IQuestion
) => {
  spinner.start(`开始创建目标文件 ${chalk.cyan(targetDir)}`);
  // 复制'project-template'到目标路径下创建工程
  copySync(
    path.join(__dirname, "..", "..", `template`),
    targetDir
  );
  // console.log(projectInfo)
  // 重写文件内容
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    ...projectInfo, ...{
      "private": true,
      "version": "0.0.0",
    }
  })

  // logger.info("开始安装项目所需依赖");
  // try {
  //   // 新建工程装包
  //   execa.commandSync("pnpm install", {
  //     stdio: "inherit",
  //     cwd: targetDir,
  //   });
  // } catch (error) {
  //   // 报错就用npm试下
  //   execa.commandSync("npm install", {
  //     stdio: "inherit",
  //     cwd: targetDir,
  //   });
  // }

  if (projectInfo.git) {
    logger.info("开始关联项目到git");
    // 关联git
    gitCmds(projectInfo.git).forEach((cmd) =>
      execa.commandSync(cmd, {
        stdio: "inherit",
        cwd: targetDir,
      })
    );
  }

  spinner.succeed(
    `目标文件创建完成 ${chalk.yellow(projectName)}\n👉 输入以下命令开始创作吧!:`
  );
  logger.info(`$ cd ${projectName}\n$ pnpm install\n$ pnpm dev\n`);
};

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

    // 检查文件是否存在
    if (!(await checkProjectExist(targetDir))) {
      // 获取用户输入
      const projectInfo = await getQuestions(projectName)
      const isNative = template === FrameworkType.reactNative
      // console.log("配置如下:", projectInfo);
      await cloneProject(targetDir, projectName, template, projectInfo);
      addTsConfig(targetDir, template, features) // typescript

      addApi(targetDir, features, CompileFrameWork.vite)
      addMock(targetDir, features) // mock
      initVite(targetDir, template, features, CompileFrameWork.vite) // vite
      initTpl(targetDir, template, features, CompileFrameWork.vite) // tpl => html
      initApp(targetDir, template, features) // generate app
      initOtherConfigFile(targetDir, template)
      addEslint(targetDir, template, features) // eslint

      const isSass = isNative ? false : addSass(targetDir, features) // sass
      addStylelint(targetDir, template, features, isSass) // stylelint

      addPrettier(targetDir, features) // prettier
      installHusky(targetDir) // husky
    }
  } catch (err: any) {
    spinner.fail(err);
    return;
  }
};

export default {
  command: "create <registry-name>",
  description: "创建一个npm私服仓库",
  optionList: [
    ["--context <context>", "上下文路径(新建文件路径)"],
    ["--template <template>", "选择哪个模版"],
  ],
  action,
};