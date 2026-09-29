import { isRegisteredPort } from "@/helpers/is-registered-port";
import type { PortInfo, Protocol } from "@/types/port";

export interface PortFilterOptions {
  query: string;
  protocol: Protocol | "all";
  devRangeOnly: boolean;
  localhostOnly: boolean;
}

export function filterPorts(
  ports: PortInfo[],
  { query, protocol, devRangeOnly, localhostOnly }: PortFilterOptions,
): PortInfo[] {
  const normalized = query.trim().toLowerCase();

  return ports.filter((p) => {
    if (devRangeOnly && !isRegisteredPort(p.port)) return false;
    if (localhostOnly && p.address !== "localhost") return false;
    if (protocol !== "all" && p.protocol !== protocol) return false;
    if (!normalized) return true;

    return (
      p.port.toString().includes(normalized) ||
      p.pid.toString().includes(normalized) ||
      p.processName.toLowerCase().includes(normalized)
    );
  });
}
