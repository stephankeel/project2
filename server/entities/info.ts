import * as OS from "os";

export class Info {
  public readonly cpus: OS.CpuInfo[] = OS.cpus();
  public readonly totalMem: number = OS.totalmem();
  public readonly freeMem: number = OS.freemem();

  constructor(public title: string, public nodeVersion: string) {
  }
}
