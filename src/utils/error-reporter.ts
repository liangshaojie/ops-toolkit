import chalk from 'chalk';
import { Logger } from './logger';

/**
 * 错误严重程度
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * 错误上下文信息
 */
export interface ErrorContext {
  command?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  additionalInfo?: Record<string, unknown>;
}

/**
 * 标准化错误报告
 */
export interface ErrorReport {
  id: string;
  code: string;
  message: string;
  severity: ErrorSeverity;
  context?: ErrorContext;
  originalError?: Error;
  stack?: string;
  timestamp: string;
  resolved: boolean;
}

/**
 * 错误报告器
 */
export class ErrorReporter {
  private static reports: Map<string, ErrorReport> = new Map();

  /**
   * 创建错误报告
   */
  static createReport(
    code: string,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: ErrorContext,
    originalError?: Error
  ): ErrorReport {
    const report: ErrorReport = {
      id: this.generateId(),
      code,
      message,
      severity,
      context: {
        timestamp: new Date().toISOString(),
        ...context,
      },
      originalError,
      stack: originalError?.stack,
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    this.reports.set(report.id, report);
    return report;
  }

  /**
   * 报告错误
   */
  static report(report: ErrorReport): void {
    const severityColor = this.getSeverityColor(report.severity);
    const icon = this.getSeverityIcon(report.severity);

    console.error(chalk.red(`${icon} 错误报告 [${report.id}]`));
    console.error(chalk.red(`  代码: ${report.code}`));
    console.error(chalk.red(`  消息: ${report.message}`));
    console.error(severityColor(`  严重程度: ${report.severity.toUpperCase()}`));
    console.error(chalk.gray(`  时间: ${report.timestamp}`));

    if (report.context) {
      console.error(chalk.cyan('  上下文:'));
      Object.entries(report.context).forEach(([key, value]) => {
        if (key !== 'timestamp') {
          console.error(chalk.cyan(`    ${key}: ${value}`));
        }
      });
    }

    if (report.originalError) {
      console.error(chalk.yellow('  原始错误:'));
      console.error(chalk.yellow(`    ${report.originalError.message}`));
    }

    if (process.env.DEBUG && report.stack) {
      console.error(chalk.gray('  堆栈跟踪:'));
      console.error(chalk.gray(report.stack));
    }

    // 记录到日志
    Logger.error(`错误报告 [${report.id}]: ${report.code} - ${report.message}`, report);
  }

  /**
   * 获取错误严重程度的颜色
   */
  private static getSeverityColor(severity: ErrorSeverity): (text: string) => string {
    switch (severity) {
      case ErrorSeverity.LOW:
        return chalk.blue;
      case ErrorSeverity.MEDIUM:
        return chalk.yellow;
      case ErrorSeverity.HIGH:
        return chalk.red;
      case ErrorSeverity.CRITICAL:
        return chalk.magenta;
      default:
        return chalk.white;
    }
  }

  /**
   * 获取错误严重程度的图标
   */
  private static getSeverityIcon(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.LOW:
        return '💡';
      case ErrorSeverity.MEDIUM:
        return '⚠️';
      case ErrorSeverity.HIGH:
        return '❌';
      case ErrorSeverity.CRITICAL:
        return '🔥';
      default:
        return '❓';
    }
  }

  /**
   * 生成唯一ID
   */
  private static generateId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取所有错误报告
   */
  static getAllReports(): ErrorReport[] {
    return Array.from(this.reports.values());
  }

  /**
   * 根据ID获取错误报告
   */
  static getReport(id: string): ErrorReport | undefined {
    return this.reports.get(id);
  }

  /**
   * 标记错误为已解决
   */
  static resolveReport(id: string): boolean {
    const report = this.reports.get(id);
    if (report) {
      report.resolved = true;
      Logger.info(`错误报告已解决: ${id}`);
      return true;
    }
    return false;
  }

  /**
   * 清理已解决的错误报告
   */
  static clearResolvedReports(): void {
    const unresolved = Array.from(this.reports.entries()).filter(([, report]) => !report.resolved);

    this.reports = new Map(unresolved);
    Logger.info('已清理解决的错误报告');
  }
}

/**
 * 错误处理中间件
 */
export function errorHandler(
  error: Error,
  context: ErrorContext = {},
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): void {
  const report = ErrorReporter.createReport(
    'UNKNOWN_ERROR',
    error.message,
    severity,
    context,
    error
  );

  ErrorReporter.report(report);

  // 根据严重程度决定是否退出程序
  if (severity === ErrorSeverity.CRITICAL) {
    Logger.error('严重错误，程序即将退出');
    process.exit(1);
  }
}

/**
 * 异步错误处理包装器
 */
export function withAsyncErrorHandling<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
  context: ErrorContext = {},
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
) {
  return async (...args: T): Promise<void> => {
    try {
      await fn(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorHandler(err, context, severity);
    }
  };
}
