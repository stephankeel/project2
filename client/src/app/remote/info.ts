export interface CpuInfo {
  model: string;
  speed: number;
  times: {
    user: number;
    nice: number;
    sys: number;
    idle: number;
    irq: number;
  };
}

export interface Info {
  readonly cpus: CpuInfo[];
  readonly totalMem: number;
  readonly freeMem: number;
  title: string;
  nodeVersion: string;
}
