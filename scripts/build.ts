#!/usr/bin/env bun

import { SystemUtils } from '../src/utils/system';

// 构建脚本
async function build() {
  console.log('🔨 Building ops-toolkit...');
  
  try {
    // 检查依赖
    console.log('📦 Checking dependencies...');
    const systemInfo = await SystemUtils.getSystemInfo();
    console.log(`✅ Platform: ${systemInfo.platform} (${systemInfo.arch})`);
    
    // 构建项目
    console.log('🏗️  Building TypeScript...');
    await SystemUtils.execCommand('bun run build');
    
    // 检查构建结果
    console.log('✅ Build completed successfully!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();