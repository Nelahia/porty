export type Protocol = "TCP" | "UDP";

export interface PortInfo {
  port: number;
  pid: number;
  processName: string;
  protocol: Protocol;
  state: string;
  address: string;
}

export interface KillResult {
  pid: number;
  success: boolean;
  error: string | null;
}
