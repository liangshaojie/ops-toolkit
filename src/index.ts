#!/usr/bin/env bun

import { createCLI } from './cli/app';

// 启动CLI应用程序
createCLI().catch(error => {
  console.error('启动失败:', error);
  process.exit(1);
});
