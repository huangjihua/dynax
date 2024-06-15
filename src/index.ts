import { getLatestVersion, getPathList, getPkgInfo, checkNodeVersion } from "./utils/index";
import { program } from "commander";
import logger from "./helpers/logger";
import * as chalk from "chalk";
const figlet = require('figlet')

/**
 * 打印指定包的最新版本信息
 *
 * @param version 当前包的版本号
 * @param name 当前包的名称
 * @returns 无返回值
 */
const printLastVersion = async (version: string, name: string) => {
  const latestVersion = await getLatestVersion(name);
  if (latestVersion !== version) {
    logger.info(
      `当前包有最新版本，可更新版本，${chalk.green(version)} -> ${chalk.green(
        latestVersion
      )} \n执行npm install -g ${name}`
    );
  }
};

/**
 * 启动函数，用于初始化CLI并注册命令
 *
 * @returns 无返回值
 */
const start = async () => {
  const packageInfo = getPkgInfo();
  const { version, name, engines } = packageInfo;
  checkNodeVersion(engines)

  // 获取所有命令
  const commandsPath = await getPathList("./commands/*.*s");

  // 注册命令
  commandsPath.forEach(async (commandPath) => {
    const commandObj = require(`./${commandPath}`);
    // console.log(commandObj.default)
    const { command, description, optionList, action } = commandObj.default;
    const curP = program
      .command(command)
      .description(description)
      .action(action);

    optionList &&
      optionList.forEach((option: [string]) => {
        curP.option(...option);
      });
  });



  // 配置版号，执行zy --version显示版本
  program.version(version);

  // 监听 --help 指令,加上额外的提示
  program.on("--help", async () => {
    // 美化logo
    console.log(chalk.white(
      "\r\n" +
      figlet.textSync(name, {
        font: "3D-ASCII",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      }))
    );
    // 前后两个空行调整格式，更舒适
    console.log(
      `Run ${chalk.cyan(
        `${name} <command> --help`
      )} for detailed usage of given command.\n`
    );

  });

  program.on("command:*", async ([cmd]) => {
    program.outputHelp();
    logger.error(`未知命令 command ${chalk.yellow(cmd)}.`);
    await printLastVersion(version, name)
    process.exitCode = 1;
  });

  // 调用参数解析去匹配命令
  program.parseAsync(process.argv);
};

// export default start
start();