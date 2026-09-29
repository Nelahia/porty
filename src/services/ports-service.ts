import { invoke } from "@tauri-apps/api/core";
import type { KillResult, PortInfo } from "@/types/port";

export function listPorts(): Promise<PortInfo[]> {
  return invoke("list_ports");
}

export function killProcess(pid: number): Promise<KillResult> {
  return invoke("kill_process", { pid });
}

export function killProcesses(pids: number[]): Promise<KillResult[]> {
  return invoke("kill_processes", { pids });
}
