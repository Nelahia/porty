import type { PortInfo } from "@/types/port";

export function countLocalhost(ports: PortInfo[]): number {
  return ports.filter((p) => p.address === "localhost").length;
}
