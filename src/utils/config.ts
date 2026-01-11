import fs from 'fs';
import path from 'path';
import os from 'os';
import { Logger, LogLevel } from './logger';
import { ConfigError } from './error-handlers';

/**
 * 配置接口定义
 */
export interface OpsConfig {
  version?: string;
  environment?: 'development' | 'production' | 'test';
  monitor: {
    refreshInterval: number;
    showProcesses: boolean;
    maxProcesses: number;
    enableRealTime: boolean;
  };
  logs: {
    defaultPath: string;
    maxLines: number;
    follow: boolean;
    level: LogLevel;
    enableFileLogging: boolean;
    logDirectory: string;
  };
  deploy: {
    defaultEnv: string;
    backupEnabled: boolean;
    confirmBeforeDeploy: boolean;
    rollbackEnabled: boolean;
    maxRetries: number;
  };
  system: {
    showHiddenServices: boolean;
    cacheTimeout: number;
    enableNotifications: boolean;
  };
  ui: {
    theme: string;
    animations: boolean;
    sound: boolean;
    language: string;
  };
  [key: string]: unknown;
}

/**
 * 配置验证器
 */
export interface ConfigValidator {
  validate(config: OpsConfig): boolean;
  getErrors(): string[];
}

/**
 * 配置管理器
 */
export class ConfigManager {
  private static configDir = path.join(os.homedir(), '.ops-toolkit');
  private static configFile = path.join(ConfigManager.configDir, 'config.json');
  private static backupDir = path.join(ConfigManager.configDir, 'backups');
  private static config: OpsConfig | null = null;
  private static validators: Map<string, ConfigValidator> = new Map();

  private static defaultConfig: OpsConfig = {
    environment: 'development',
    version: '1.2.0',
    monitor: {
      refreshInterval: 5000,
      showProcesses: true,
      maxProcesses: 20,
      enableRealTime: false,
    },
    logs: {
      defaultPath: '/var/log',
      maxLines: 1000,
      follow: false,
      level: LogLevel.INFO,
      enableFileLogging: false,
      logDirectory: path.join(os.homedir(), '.ops-toolkit', 'logs'),
    },
    deploy: {
      defaultEnv: 'production',
      backupEnabled: true,
      confirmBeforeDeploy: true,
      rollbackEnabled: true,
      maxRetries: 3,
    },
    system: {
      showHiddenServices: false,
      cacheTimeout: 30000,
      enableNotifications: true,
    },
    ui: {
      theme: 'default',
      animations: true,
      sound: false,
      language: 'zh-CN',
    },
  };

  /**
   * 初始化配置系统
   */
  static async initialize(): Promise<void> {
    try {
      await this.ensureDirectories();

      if (!fs.existsSync(this.configFile)) {
        await this.createDefaultConfig();
      }

      await this.loadConfig();
      await this.validateConfig();

      Logger.info('配置系统初始化完成', { configDir: this.configDir });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      throw new ConfigError(`配置系统初始化失败: ${err.message}`);
    }
  }

  /**
   * 确保必要的目录存在
   */
  private static async ensureDirectories(): Promise<void> {
    const directories = [this.configDir, this.backupDir];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        Logger.debug(`创建目录: ${dir}`);
      }
    }
  }

  /**
   * 创建默认配置
   */
  private static async createDefaultConfig(): Promise<void> {
    try {
      const configJson = JSON.stringify(this.defaultConfig, null, 2);
      fs.writeFileSync(this.configFile, configJson, 'utf8');
      Logger.success('创建默认配置文件', { configFile: this.configFile });
    } catch (error) {
      throw new ConfigError(`创建默认配置失败: ${error}`);
    }
  }

  /**
   * 加载配置
   */
  private static async loadConfig(): Promise<void> {
    try {
      const configData = fs.readFileSync(this.configFile, 'utf8');
      const loadedConfig = JSON.parse(configData) as OpsConfig;

      // 合并默认配置和加载的配置
      this.config = this.mergeConfigs(this.defaultConfig, loadedConfig);

      Logger.debug('配置加载完成', {
        environment: this.config.environment,
        version: this.config.version,
      });
    } catch (error) {
      throw new ConfigError(`加载配置失败: ${error}`);
    }
  }

  /**
   * 合并配置对象
   */
  private static mergeConfigs(defaultConfig: OpsConfig, userConfig: OpsConfig): OpsConfig {
    const merged = { ...defaultConfig, ...userConfig };

    // 深度合并嵌套对象
    for (const key in defaultConfig) {
      if (
        key in userConfig &&
        typeof defaultConfig[key] === 'object' &&
        typeof userConfig[key] === 'object' &&
        !Array.isArray(defaultConfig[key]) &&
        !Array.isArray(userConfig[key])
      ) {
        merged[key] = {
          ...defaultConfig[key],
          ...userConfig[key],
        } as OpsConfig[Extract<keyof OpsConfig, string>];
      }
    }

    return merged;
  }

  /**
   * 验证配置
   */
  private static async validateConfig(): Promise<void> {
    if (!this.config) {
      throw new ConfigError('配置未初始化');
    }

    let allValid = true;
    const allErrors: string[] = [];

    // 运行所有验证器
    for (const [name, validator] of this.validators) {
      const isValid = validator.validate(this.config);
      if (!isValid) {
        allValid = false;
        const errors = validator.getErrors();
        allErrors.push(...errors.map(err => `[${name}] ${err}`));
      }
    }

    if (!allValid) {
      const errorMessage = `配置验证失败:\n${allErrors.join('\n')}`;
      Logger.error(errorMessage);
      throw new ConfigError(errorMessage);
    }

    Logger.debug('配置验证通过');
  }

  /**
   * 注册配置验证器
   */
  static registerValidator(name: string, validator: ConfigValidator): void {
    this.validators.set(name, validator);
    Logger.debug(`注册配置验证器: ${name}`);
  }

  /**
   * 获取配置
   */
  static get<T = OpsConfig>(key?: string): OpsConfig | T {
    if (!this.config) {
      throw new ConfigError('配置未初始化，请先调用 initialize()');
    }

    if (!key) {
      return { ...this.config };
    }

    return this.getNestedValue<T>(this.config, key);
  }

  /**
   * 设置配置
   */
  static async set<T = unknown>(key: string, value: T): Promise<void> {
    if (!this.config) {
      throw new ConfigError('配置未初始化，请先调用 initialize()');
    }

    try {
      // 创建备份
      await this.createBackup();

      // 设置值
      this.setNestedValue(this.config, key, value);

      // 保存配置
      await this.saveConfig();

      // 验证配置
      await this.validateConfig();

      Logger.success(`配置更新成功: ${key}`, { value });
    } catch (error) {
      // 回滚配置
      await this.rollbackFromBackup();
      throw new ConfigError(`设置配置失败: ${error}`);
    }
  }

  /**
   * 保存配置
   */
  private static async saveConfig(): Promise<void> {
    if (!this.config) {
      throw new ConfigError('配置未初始化');
    }

    try {
      const configJson = JSON.stringify(this.config, null, 2);
      fs.writeFileSync(this.configFile, configJson, 'utf8');
      Logger.debug('配置保存完成');
    } catch (error) {
      throw new ConfigError(`保存配置失败: ${error}`);
    }
  }

  /**
   * 创建配置备份
   */
  private static async createBackup(): Promise<void> {
    if (!fs.existsSync(this.configFile)) {
      return;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `config-backup-${timestamp}.json`);

      fs.copyFileSync(this.configFile, backupFile);
      Logger.debug('配置备份创建完成', { backupFile });
    } catch (error) {
      Logger.warning('创建配置备份失败', { error: String(error) });
    }
  }

  /**
   * 从备份回滚
   */
  private static async rollbackFromBackup(): Promise<void> {
    try {
      const backupFiles = fs
        .readdirSync(this.backupDir)
        .filter(file => file.startsWith('config-backup-'))
        .sort()
        .reverse();

      if (backupFiles.length > 0) {
        const latestBackup = backupFiles[0];
        if (latestBackup) {
          const backupPath = path.join(this.backupDir, latestBackup);

          fs.copyFileSync(backupPath, this.configFile);
          await this.loadConfig();

          Logger.info('配置已回滚到最新备份', { backupFile: latestBackup });
        }
      }
    } catch (error) {
      Logger.error('配置回滚失败', { error });
    }
  }

  /**
   * 重置配置
   */
  static async reset(): Promise<void> {
    try {
      await this.createBackup();
      this.config = { ...this.defaultConfig };
      await this.saveConfig();
      await this.validateConfig();

      Logger.success('配置已重置为默认值');
    } catch (error) {
      throw new ConfigError(`重置配置失败: ${error}`);
    }
  }

  /**
   * 重新加载配置
   */
  static async reload(): Promise<void> {
    try {
      await this.loadConfig();
      await this.validateConfig();
      Logger.info('配置重新加载完成');
    } catch (error) {
      throw new ConfigError(`重新加载配置失败: ${error}`);
    }
  }

  /**
   * 获取嵌套值
   */
  private static getNestedValue<T = unknown>(obj: OpsConfig, key: string): T {
    const keys = key.split('.');
    let current: unknown = obj;

    for (const keyPart of keys) {
      if (current && typeof current === 'object' && keyPart in current) {
        current = (current as Record<string, unknown>)[keyPart];
      } else {
        return undefined as T;
      }
    }

    return current as T;
  }

  /**
   * 设置嵌套值
   */
  private static setNestedValue(obj: OpsConfig, key: string, value: unknown): void {
    const keys = key.split('.');
    const lastKey = keys.pop();

    if (!lastKey) return;

    let current: Record<string, unknown> = obj as Record<string, unknown>;

    for (const keyPart of keys) {
      if (!(keyPart in current) || !current[keyPart] || typeof current[keyPart] !== 'object') {
        current[keyPart] = {};
      }
      current = current[keyPart] as Record<string, unknown>;
    }

    current[lastKey] = value;
  }

  /**
   * 获取配置目录
   */
  static getConfigDir(): string {
    return this.configDir;
  }

  /**
   * 获取配置文件路径
   */
  static getConfigFile(): string {
    return this.configFile;
  }

  /**
   * 获取备份目录
   */
  static getBackupDir(): string {
    return this.backupDir;
  }

  /**
   * 清理旧备份
   */
  static async cleanOldBackups(maxBackups: number = 10): Promise<void> {
    try {
      const backupFiles = fs
        .readdirSync(this.backupDir)
        .filter(file => file.startsWith('config-backup-'))
        .map(file => ({
          file,
          path: path.join(this.backupDir, file),
          mtime: fs.statSync(path.join(this.backupDir, file)).mtime,
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      if (backupFiles.length > maxBackups) {
        const filesToDelete = backupFiles.slice(maxBackups);

        for (const { file, path: filePath } of filesToDelete) {
          if (filePath) {
            fs.unlinkSync(filePath);
            Logger.debug('删除旧备份文件', { file });
          }
        }
      }

      Logger.debug('备份清理完成', {
        totalBackups: backupFiles.length,
        keptBackups: Math.min(maxBackups, backupFiles.length),
      });
    } catch (error) {
      Logger.warning('清理备份文件失败', { error });
    }
  }
}

// 向后兼容的Config类
export class Config extends ConfigManager {}
