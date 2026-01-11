import { ErrorSeverity, errorHandler } from './error-reporter';

/**
 * 自定义错误类型
 */
export class CLIError extends Error {
  public readonly code: string;
  public readonly exitCode: number;

  constructor(message: string, code: string = 'CLI_ERROR', exitCode: number = 1) {
    super(message);
    this.name = 'CLIError';
    this.code = code;
    this.exitCode = exitCode;
  }
}

export class CommandError extends CLIError {
  constructor(message: string, command: string = '') {
    super(`命令执行失败: ${command} - ${message}`, 'COMMAND_ERROR');
    this.name = 'CommandError';
  }
}

export class ConfigError extends CLIError {
  constructor(message: string) {
    super(`配置错误: ${message}`, 'CONFIG_ERROR');
    this.name = 'ConfigError';
  }
}

export class SystemError extends CLIError {
  constructor(message: string) {
    super(`系统错误: ${message}`, 'SYSTEM_ERROR');
    this.name = 'SystemError';
  }
}

/**
 * 设置全局错误处理器
 */
export function setupErrorHandlers(): void {
  // 未捕获异常处理
  process.on('uncaughtException', (error: Error) => {
    errorHandler(error, { action: 'uncaught_exception' }, ErrorSeverity.CRITICAL);
  });

  // 未处理的Promise拒绝
  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    errorHandler(
      error,
      {
        action: 'unhandled_rejection',
        additionalInfo: { promise: promise.toString() },
      },
      ErrorSeverity.HIGH
    );
  });
}

/**
 * 包装异步函数，提供错误处理
 */
export function withErrorHandling<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
  context?: string
) {
  return async (...args: T): Promise<void> => {
    try {
      await fn(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (err instanceof CLIError) {
        errorHandler(
          err,
          {
            action: context || 'unknown_action',
            additionalInfo: {
              errorCode: err.code,
              exitCode: err.exitCode,
            },
          },
          err.exitCode === 1 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM
        );
        process.exit(err.exitCode);
      } else {
        errorHandler(err, { action: context || 'unknown_action' }, ErrorSeverity.HIGH);
        process.exit(1);
      }
    }
  };
}
