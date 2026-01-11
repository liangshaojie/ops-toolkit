// 系统相关的类型定义
export interface SystemInfo {
  hostname: string;
  platform: string;
  arch: string;
  uptime: number;
  loadAverage: number[];
  totalMemory: number;
  freeMemory: number;
  cpus: CpuInfo[];
}

export interface CpuInfo {
  model: string;
  speed: number;
  cores: number;
  usage: number;
}

export interface MemoryInfo {
  total: number;
  free: number;
  used: number;
  cached: number;
  buffers: number;
  percentage: number;
}

export interface DiskInfo {
  filesystem: string;
  size: number;
  used: number;
  available: number;
  percentage: number;
  mountpoint: string;
}

export interface NetworkInfo {
  interface: string;
  ip4: string;
  ip6: string;
  mac: string;
  speed: number;
  rx: number;
  tx: number;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: string;
  user: string;
  command: string;
}

export interface ServiceInfo {
  name: string;
  status: 'running' | 'stopped' | 'failed' | 'unknown';
  enabled: boolean;
  cpu: number;
  memory: number;
  uptime?: number;
}
