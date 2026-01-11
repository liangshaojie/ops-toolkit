#!/usr/bin/env bun

// 简单的调试脚本示例
import { SystemUtils } from '../src/utils/system';
import { Logger } from '../src/utils/logger';
import { Config } from '../src/utils/config';

async function testSystemUtils() {
  console.log('🔍 Testing SystemUtils...');
  
  try {
    // 测试系统信息获取
    debugger; // ← 设置断点
    const systemInfo = await SystemUtils.getSystemInfo();
    console.log('System Info:', systemInfo);
    
    // 测试内存使用情况
    debugger; // ← 设置断点
    const memoryUsage = SystemUtils.getMemoryUsage();
    console.log('Memory Usage:', memoryUsage);
    
    // 测试字节格式化
    const formattedBytes = SystemUtils.formatBytes(1024 * 1024 * 512);
    console.log('Formatted Bytes:', formattedBytes);
    
  } catch (error) {
    debugger; // ← 设置断点
    console.error('Error in SystemUtils test:', error);
  }
}

async function testLogger() {
  console.log('🔍 Testing Logger...');
  
  debugger; // ← 设置断点
  Logger.info('This is an info message');
  Logger.success('This is a success message');
  Logger.warning('This is a warning message');
  Logger.error('This is an error message');
  Logger.debug('This is a debug message');
}

async function testConfig() {
  console.log('🔍 Testing Config...');
  
  try {
    debugger; // ← 设置断点
    const config = Config.get();
    console.log('Config:', config);
    
    debugger; // ← 设置断点
    const monitorConfig = Config.get('monitor.refreshInterval');
    console.log('Monitor refresh interval:', monitorConfig);
    
  } catch (error) {
    debugger; // ← 设置断点
    console.error('Error in Config test:', error);
  }
}

async function main() {
  console.log('🐛 Starting debugging session...\n');
  
  await testSystemUtils();
  console.log('\n');
  
  await testLogger();
  console.log('\n');
  
  await testConfig();
  console.log('\n✅ Debug session completed');
}

// 启动调试
debugger; // ← 设置断点
main().catch(console.error);