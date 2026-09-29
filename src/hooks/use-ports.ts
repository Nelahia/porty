import { useCallback, useEffect, useRef, useState } from "react";
import { listPorts } from "@/services/ports-service";
import type { PortInfo } from "@/types/port";

const POLL_INTERVAL_MS = 1500;

export function usePorts() {
  const [ports, setPorts] = useState<PortInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const result = await listPorts();
      if (isMounted.current) {
        setPorts(result);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) setError(String(err));
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      isMounted.current = false;
      clearInterval(id);
    };
  }, [refresh]);

  return { ports, isLoading, error, refresh };
}
