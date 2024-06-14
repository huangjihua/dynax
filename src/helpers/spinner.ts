import * as ora from "ora"
import * as chalk from "chalk";

type PromiseOptions<T> = {
  /**
  The new text of the spinner when the promise is resolved.

  Keeps the existing text if `undefined`.
  */
  successText?: string | ((result: T) => string) | undefined;

  /**
  The new text of the spinner when the promise is rejected.

  Keeps the existing text if `undefined`.
  */
  failText?: string | ((error: Error) => string) | undefined;
} & ora.Options;
export async function oraPromise<T>(action: PromiseLike<T> | ((spinner: ora.Ora) => PromiseLike<T>), options?: string | PromiseOptions<T>): Promise<T> {
  const actionIsFunction = typeof action === 'function';
  const actionIsPromise = !actionIsFunction && typeof action.then === 'function';

  if (!actionIsFunction && !actionIsPromise) {
    throw new TypeError('Parameter `action` must be a Function or a Promise');
  }

  const spinnerOptions = typeof options === 'object' ? options : { text: options, successText: undefined, failText: undefined };
  console.log(spinnerOptions)
  const spinner = ora(spinnerOptions as ora.Options).start(); // 确保正确类型转换

  try {
    const promise = actionIsFunction ? action(spinner) : action;
    const result = await promise;
    // setTimeout(() => {
    spinner.succeed(
      typeof spinnerOptions.successText === 'function'
        ? spinnerOptions.successText(result)
        : spinnerOptions.successText
    );
    // }, 2000);
    return result;
  } catch (error) {
    // setTimeout(() => {
    spinner.fail(
      typeof spinnerOptions.failText === 'function'
        ? spinnerOptions.failText(error)
        : spinnerOptions.failText
    );
    // }, 2000)
    // throw error;
    return error
  }
}

export class Spinner {
  spinner: ora.Ora;

  constructor() {
    this.spinner = ora({ spinner: 'dots' });
  }
  // 开始加载
  start = (text?: string) => {
    const msg = `${text}...\n`;
    // this.spinner.start(msg);
    this.spinner.stopAndPersist({
      symbol: "✨",
      text: msg,
    });


  };
  succeed = (text?: string) => {
    this.spinner.succeed(chalk.blue(text))
  };
  // 加载成功
  end = (text?: string) => {
    this.spinner.stopAndPersist({
      symbol: "\n🎉",
      text: `${text}\n`,
    });
  };
  loading = (text?: string) => {
    this.spinner.start(text)
  }
  // 加载失败
  fail = (text?: string) => {
    // this.spinner.fail(chalk.red(text));
  };
}

const spinner = new Spinner();
export default spinner;