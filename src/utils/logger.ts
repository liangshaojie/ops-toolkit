import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';
import fs from 'fs';
import path from 'path';
import os from 'os';
import type { ErrorReport } from './error-reporter';

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

/**
 * 日志条目
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  module?: string;
}

/**
 * 日志配置
 */
export interface LogConfig {
  level: LogLevel;
  enableFileLogging: boolean;
  logDirectory: string;
  maxFileSize: number;
  maxFiles: number;
  enableConsoleColors: boolean;
  enableStructuredOutput: boolean;
}

/**
 * 增强的日志工具类
 */
export class Logger {
  private static config: LogConfig = {
    level: LogLevel.INFO,
    enableFileLogging: false,
    logDirectory: path.join(os.homedir(), '.ops-toolkit', 'logs'),
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    enableConsoleColors: true,
    enableStructuredOutput: false,
  };

  private static logBuffer: LogEntry[] = [];
  private static maxBufferSize = 1000;

  /**
   * 配置日志系统
   */
  static configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.config.enableFileLogging) {
      this.ensureLogDirectory();
    }
  }

  /**
   * 确保日志目录存在
   */
  private static ensureLogDirectory(): void {
    if (!fs.existsSync(this.config.logDirectory)) {
      fs.mkdirSync(this.config.logDirectory, { recursive: true });
    }
  }

  /**
   * 获取日志级别名称
   */
  private static getLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'DEBUG';
      case LogLevel.INFO:
        return 'INFO';
      case LogLevel.WARN:
        return 'WARN';
      case LogLevel.ERROR:
        return 'ERROR';
      case LogLevel.CRITICAL:
        return 'CRITICAL';
      default:
        return 'UNKNOWN';
    }
  }

  /**
   * 获取日志级别颜色
   */
  private static getLevelColor(level: LogLevel): (text: string) => string {
    if (!this.config.enableConsoleColors) {
      return (text: string) => text;
    }

    switch (level) {
      case LogLevel.DEBUG:
        return chalk.gray;
      case LogLevel.INFO:
        return chalk.blue;
      case LogLevel.WARN:
        return chalk.yellow;
      case LogLevel.ERROR:
        return chalk.red;
      case LogLevel.CRITICAL:
        return chalk.magenta;
      default:
        return chalk.white;
    }
  }

  /**
   * 格式化控制台消息
   */
  private static formatConsoleMessage(entry: LogEntry): string {
    const levelName = this.getLevelName(entry.level);
    const color = this.getLevelColor(entry.level);
    const timestamp = entry.timestamp;

    let message = `${color(`[${timestamp}] [${levelName}]`)} ${entry.message}`;

    if (entry.module) {
      message += chalk.gray(` (${entry.module})`);
    }

    if (entry.context && Object.keys(entry.context).length > 0) {
      const contextStr = Object.entries(entry.context)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');
      message += chalk.gray(` [${contextStr}]`);
    }

    return message;
  }

  /**
   * 格式化文件日志消息（JSON格式）
   */
  private static formatFileMessage(entry: LogEntry): string {
    return JSON.stringify(entry, null, 0);
  }

  /**
   * 记录日志条目
   */
  private static logEntry(entry: LogEntry): void {
    if (entry.level < this.config.level) {
      return;
    }

    // 控制台输出
    console.log(this.formatConsoleMessage(entry));

    // 文件输出
    if (this.config.enableFileLogging) {
      this.writeToFile(entry);
    }

    // 添加到缓冲区
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // 如果是严重错误，额外处理
    if (entry.level >= LogLevel.ERROR) {
      if (entry.error) {
        this.handleSeriousError(entry);
      }
    }
  }

  /**
   * 写入日志文件
   */
  private static writeToFile(entry: LogEntry): void {
    try {
      const logFile = path.join(
        this.config.logDirectory,
        `ops-toolkit-${this.getDateString()}.log`
      );
      const message = this.formatFileMessage(entry) + '\n';

      // 检查文件大小
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        if (stats.size > this.config.maxFileSize) {
          this.rotateLogFile(logFile);
        }
      }

      fs.appendFileSync(logFile, message, 'utf8');
    } catch (error) {
      console.error('写入日志文件失败:', error);
    }
  }

  /**
   * 轮转日志文件
   */
  private static rotateLogFile(logFile: string): void {
    const baseName = logFile.replace(/\.log$/, '');

    // 删除最老的日志文件
    const oldestFile = `${baseName}-${this.config.maxFiles}.log`;
    if (fs.existsSync(oldestFile)) {
      fs.unlinkSync(oldestFile);
    }

    // 轮转现有文件
    for (let i = this.config.maxFiles - 1; i >= 1; i--) {
      const currentFile = `${baseName}-${i}.log`;
      const nextFile = `${baseName}-${i + 1}.log`;
      if (fs.existsSync(currentFile)) {
        fs.renameSync(currentFile, nextFile);
      }
    }

    // 移动当前文件
    const firstRotatedFile = `${baseName}-1.log`;
    if (fs.existsSync(logFile)) {
      fs.renameSync(logFile, firstRotatedFile);
    }
  }

  /**
   * 获取日期字符串
   */
  private static getDateString(): string {
    const dateStr = new Date().toISOString().split('T')[0];
    return dateStr || new Date().toISOString().slice(0, 10);
  }

  /**
   * 处理严重错误
   */
  private static handleSeriousError(entry: LogEntry): void {
    if (entry.error) {
      const errorReport: Partial<ErrorReport> = {
        code: 'LOG_ERROR',
        message: entry.message,
        originalError: entry.error,
        context: entry.context,
      };

      // 这里可以集成错误报告系统
      console.error('严重错误已记录:', errorReport);
    }
  }

  /**
   * 调试日志
   */
  static debug(message: string, context?: Record<string, unknown>, module?: string): void {
    this.logEntry({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      context,
      module,
    });
  }

  /**
   * 信息日志
   */
  static info(message: string, context?: Record<string, unknown>, module?: string): void {
    this.logEntry({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      context,
      module,
    });
  }

  /**
   * 警告日志
   */
  static warn(message: string, context?: Record<string, unknown>, module?: string): void {
    this.logEntry({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      context,
      module,
    });
  }

  /**
   * 警告日志（别名）
   */
  static warning(message: string, context?: Record<string, unknown>, module?: string): void {
    this.warn(message, context, module);
  }

  /**
   * 错误日志
   */
  static error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>,
    module?: string
  ): void {
    const err = error instanceof Error ? error : undefined;
    this.logEntry({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      error: err,
      context: error && !err ? { error: String(error) } : context,
      module,
    });
  }

  /**
   * 严重错误日志
   */
  static critical(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>,
    module?: string
  ): void {
    const err = error instanceof Error ? error : undefined;
    this.logEntry({
      timestamp: new Date().toISOString(),
      level: LogLevel.CRITICAL,
      message,
      error: err,
      context: error && !err ? { error: String(error) } : context,
      module,
    });
  }

  /**
   * 成功日志（info的别名，绿色显示）
   */
  static success(message: string, context?: Record<string, unknown>, module?: string): void {
    if (this.config.enableConsoleColors) {
      const successMessage = chalk.green(message);
      this.logEntry({
        timestamp: new Date().toISOString(),
        level: LogLevel.INFO,
        message: `✅ ${successMessage}`,
        context,
        module,
      });
    } else {
      this.info(`✅ ${message}`, context, module);
    }
  }

  /**
   * 显示标题
   */
  static showTitle(text: string, font: string = 'Standard'): void {
    console.log(chalk.cyan(figlet.textSync(text, { font })));
  }

  /**
   * 显示框
   */
  static showBox(content: string, options?: Record<string, unknown>): void {
    const boxOptions = {
      padding: 1,
      margin: 1,
      borderStyle: 'round' as const,
      borderColor: 'cyan',
      ...options,
    };

    console.log(boxen(content, boxOptions));
  }

  /**
   * 显示分隔线
   */
  static separator(char: string = '-', length: number = 50): void {
    console.log(chalk.gray(char.repeat(length)));
  }

  /**
   * 显示加载动画
   */
  static spinner(message: string): {
    start: () => void;
    stop: () => void;
    succeed: (text?: string) => void;
    fail: (text?: string) => void;
    warn: (text?: string) => void;
    info: (text?: string) => void;
  } {
    const ora = require('ora');
    return ora(message).start();
  }

  /**
   * 获取日志缓冲区
   */
  static getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * 清空日志缓冲区
   */
  static clearLogBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * 设置日志级别
   */
  static setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * 启用文件日志
   */
  static enableFileLogging(directory?: string): void {
    this.config.enableFileLogging = true;
    if (directory) {
      this.config.logDirectory = directory;
    }
    this.ensureLogDirectory();
  }

  /**
   * 禁用文件日志
   */
  static disableFileLogging(): void {
    this.config.enableFileLogging = false;
  }

  /**
   * 获取当前配置
   */
  static getConfig(): LogConfig {
    return { ...this.config };
  }
}
