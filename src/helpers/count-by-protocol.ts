import type { PortInfo } from "@/types/port";

export function countByProtocol(ports: PortInfo[]) {
  return {
    tcp: ports.filter((p) => p.protocol === "TCP").length,
    udp: ports.filter((p) => p.protocol === "UDP").length,
  };
}
