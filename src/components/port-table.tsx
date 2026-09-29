import { Inbox } from "lucide-react";
import { PortRow } from "@/components/port-row";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PortInfo } from "@/types/port";

interface PortTableProps {
  ports: PortInfo[];
  onKill: (pid: number) => void;
}

export function PortTable({ ports, onKill }: PortTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/40 shadow-lg shadow-black/20">
      {ports.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Inbox className="size-8" />
          <p className="text-sm">No listening port matches.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24">Port</TableHead>
              <TableHead>Process</TableHead>
              <TableHead className="w-20">PID</TableHead>
              <TableHead className="w-24">Protocol</TableHead>
              <TableHead className="w-16 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ports.map((port) => (
              <PortRow
                key={`${port.pid}-${port.port}-${port.protocol}`}
                port={port}
                onKill={onKill}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
