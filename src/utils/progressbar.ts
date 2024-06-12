const chalk = require('chalk');
const ProgressBar = require('progress');

type OptionsType = {
  total: number,
  width: number;
  completeColor?: string;
  incompleteColor?: string;
  renderThrottle?: number;
  callback?: () => void;
}



/**
 * 创建一个进度条
 *
 * @param options 配置选项
 * @param options.total 总进度，默认为20
 * @param options.width 进度条宽度，默认为30
 * @param options.completeColor 完成部分颜色，默认为'green'
 * @param options.incompleteColor 未完成部分颜色，默认为'red'
 * @param options.renderThrottle 渲染节流时间，单位为毫秒，默认为100
 * @param options.callback 完成时的回调函数
 * @returns 返回一个包含 tick 方法的对象
 */
export default function createProgressBar(options: OptionsType) {
  const {
    total = 20,
    width = 30,
    completeColor = 'green',
    incompleteColor = 'red',
    renderThrottle = 100,
    callback
  } = options;

  const bar = new ProgressBar(':bar :percent :etas', {
    total,
    width,
    complete: chalk[completeColor]('█'),
    incomplete: chalk[incompleteColor]('█'),
    renderThrottle,
  });

  return {
    tick: (increment = 1) => {
      bar.tick(increment);
      if (bar.complete && callback) {
        callback();
      }
    },
  };
}
