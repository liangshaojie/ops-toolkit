import fs from 'fs';
import path from 'path';
import os from 'os';
import { Logger } from './logger';

// 配置管理类
export class Config {
  private static configDir = path.join(os.homedir(), '.ops-toolkit');
  private static configFile = path.join(Config.configDir, 'config.json');
  private static defaultConfig = {
    monitor: {
      refreshInterval: 5000,
      showProcesses: true,
      maxProcesses: 20,
    },
    logs: {
      defaultPath: '/var/log',
      maxLines: 1000,
      follow: false,
    },
    deploy: {
      defaultEnv: 'production',
      backupEnabled: true,
      confirmBeforeDeploy: true,
    },
    system: {
      showHiddenServices: false,
      cacheTimeout: 30000,
    },
    ui: {
      theme: 'default',
      animations: true,
      sound: false,
    },
  };

  // 获取配置
  static get(key?: string): any {
    try {
      if (!fs.existsSync(this.configFile)) {
        this.createDefaultConfig();
      }

      const configData = fs.readFileSync(this.configFile, 'utf8');
      const config = JSON.parse(configData);

      if (key) {
        return this.getNestedValue(config, key);
      }

      return config;
    } catch (error) {
      Logger.error(`Failed to read config: ${error}`);
      return this.defaultConfig;
    }
  }

  // 设置配置
  static set(key: string, value: any): void {
    try {
      const config = this.get();
      this.setNestedValue(config, key, value);

      fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
      Logger.success(`Configuration updated: ${key}`);
    } catch (error) {
      Logger.error(`Failed to set config: ${error}`);
    }
  }

  // 重置配置
  static reset(): void {
    try {
      this.createDefaultConfig();
      Logger.success('Configuration reset to defaults');
    } catch (error) {
      Logger.error(`Failed to reset config: ${error}`);
    }
  }

  // 创建默认配置
  private static createDefaultConfig(): void {
    try {
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }

      fs.writeFileSync(this.configFile, JSON.stringify(this.defaultConfig, null, 2));
    } catch (error) {
      Logger.error(`Failed to create default config: ${error}`);
    }
  }

  // 获取嵌套值
  private static getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((current, keyPart) => {
      return current && current[keyPart];
    }, obj);
  }

  // 设置嵌套值
  private static setNestedValue(obj: any, key: string, value: any): void {
    const keys = key.split('.');
    const lastKey = keys.pop()!;

    const target = keys.reduce((current, keyPart) => {
      if (!current[keyPart]) {
        current[keyPart] = {};
      }
      return current[keyPart];
    }, obj);

    target[lastKey] = value;
  }

  // 验证配置
  static validate(): boolean {
    try {
      const config = this.get();

      // 基本验证
      if (!config.monitor || !config.logs || !config.deploy) {
        return false;
      }

      // 类型验证
      if (typeof config.monitor.refreshInterval !== 'number') {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // 获取配置目录
  static getConfigDir(): string {
    return this.configDir;
  }

  // 获取配置文件路径
  static getConfigFile(): string {
    return this.configFile;
  }
}
