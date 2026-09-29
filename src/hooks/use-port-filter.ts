import { useMemo, useState } from "react";
import { filterPorts } from "@/helpers/filter-ports";
import type { PortInfo, Protocol } from "@/types/port";

export function usePortFilter(ports: PortInfo[]) {
  const [query, setQuery] = useState("");
  const [protocol, setProtocol] = useState<Protocol | "all">("all");
  const [devRangeOnly, setDevRangeOnly] = useState(true);
  const [localhostOnly, setLocalhostOnly] = useState(false);

  const filtered = useMemo(
    () => filterPorts(ports, { query, protocol, devRangeOnly, localhostOnly }),
    [ports, query, protocol, devRangeOnly, localhostOnly],
  );

  return {
    query,
    setQuery,
    protocol,
    setProtocol,
    devRangeOnly,
    setDevRangeOnly,
    localhostOnly,
    setLocalhostOnly,
    filtered,
  };
}
