import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

// 日志工具类
export class Logger {
  private static formatMessage(level: string, message: string, color: any): string {
    const timestamp = new Date().toISOString();
    return `${color(`[${timestamp}] [${level}]`)} ${message}`;
  }

  static info(message: string): void {
    console.log(this.formatMessage('INFO', message, chalk.blue));
  }

  static success(message: string): void {
    console.log(this.formatMessage('SUCCESS', message, chalk.green));
  }

  static warning(message: string): void {
    console.log(this.formatMessage('WARNING', message, chalk.yellow));
  }

  static error(message: string): void {
    console.error(this.formatMessage('ERROR', message, chalk.red));
  }

  static debug(message: string): void {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      console.log(this.formatMessage('DEBUG', message, chalk.gray));
    }
  }

  // 显示标题
  static showTitle(text: string, font: string = 'Standard'): void {
    console.log(chalk.cyan(figlet.textSync(text, { font })));
  }

  // 显示框
  static showBox(content: string, options?: any): void {
    const boxOptions = {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      ...options,
    };

    console.log(boxen(content, boxOptions));
  }

  // 显示分隔线
  static separator(char: string = '-', length: number = 50): void {
    console.log(chalk.gray(char.repeat(length)));
  }

  // 显示加载动画
  static spinner(message: string): any {
    const ora = require('ora');
    return ora(message).start();
  }
}
