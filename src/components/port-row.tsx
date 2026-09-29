import { Skull, SquareTerminal } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { PortInfo } from "@/types/port";

interface PortRowProps {
  port: PortInfo;
  onKill: (pid: number) => void;
}

export function PortRow({ port, onKill }: PortRowProps) {
  return (
    <TableRow className="group">
      <TableCell>
        <span className="inline-flex items-center gap-2 font-mono text-base font-semibold text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          {port.port}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-2">
            <SquareTerminal className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{port.processName}</span>
          </span>
          <span className="pl-6 text-xs text-muted-foreground">
            {port.address}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-mono text-muted-foreground">
        {port.pid}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={
            port.protocol === "TCP"
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-violet-400/30 bg-violet-400/10 text-violet-300"
          }
        >
          {port.protocol}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Kill process ${port.processName}`}
                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100"
              >
                <Skull className="size-4" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kill {port.processName}?</AlertDialogTitle>
              <AlertDialogDescription>
                {port.processName} (PID {port.pid}) listening on port{" "}
                {port.port} will be stopped immediately. This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onKill(port.pid)}>
                Kill
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
