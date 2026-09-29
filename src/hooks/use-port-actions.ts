import { useCallback } from "react";
import { toast } from "sonner";
import { killProcess, killProcesses } from "@/services/ports-service";
import type { PortInfo } from "@/types/port";

export function usePortActions(refresh: () => void) {
  const killOne = useCallback(
    async (pid: number) => {
      const result = await killProcess(pid);
      if (result.success) {
        toast.success(`Process ${pid} stopped`);
      } else {
        toast.error(result.error ?? `Could not stop process ${pid}`);
      }
      refresh();
    },
    [refresh],
  );

  const killMany = useCallback(
    async (ports: PortInfo[]) => {
      const results = await killProcesses(ports.map((p) => p.pid));
      const succeeded = results.filter((r) => r.success).length;
      const failed = results.length - succeeded;
      if (succeeded > 0) toast.success(`${succeeded} process(es) stopped`);
      if (failed > 0) toast.error(`${failed} process(es) could not be stopped`);
      refresh();
    },
    [refresh],
  );

  return { killOne, killMany };
}
