import * as ora from "ora";
import * as chalk from "chalk";

export class Spinner {
  spinner: ora.Ora;

  constructor() {
    this.spinner = ora({ spinner: 'dots', });
  }
  // 开始加载
  start = (text?: string) => {
    const msg = `${text}...\n`;
    this.spinner.start(msg);
    this.spinner.stopAndPersist({
      symbol: "✨",
      text: msg,
    });
  };
  succeed = (text?: string) => {
    this.spinner.succeed(text)
  };
  // 加载成功
  end = (text?: string) => {
    this.spinner.stopAndPersist({
      symbol: "🎉",
      text: `${text}\n`,
    });
  };
  loading = (text?: string) => {
    this.spinner.start(text)
  }
  // 加载失败
  fail = (text?: string) => {
    this.spinner.fail(chalk.red(text));
  };
}

const spinner = new Spinner();
export default spinner;