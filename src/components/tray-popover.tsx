import { DevRangeToggle } from "@/components/dev-range-toggle";
import { KillAllButton } from "@/components/kill-all-button";
import { PortTable } from "@/components/port-table";
import { SearchBar } from "@/components/search-bar";
import { StatPill } from "@/components/stat-pill";
import { Toaster } from "@/components/ui/sonner";
import { countByProtocol } from "@/helpers/count-by-protocol";
import { countLocalhost } from "@/helpers/count-localhost";
import { usePortActions } from "@/hooks/use-port-actions";
import { usePortFilter } from "@/hooks/use-port-filter";
import { usePorts } from "@/hooks/use-ports";

export function TrayPopover() {
  const { ports, refresh } = usePorts();
  const {
    query,
    setQuery,
    protocol,
    setProtocol,
    devRangeOnly,
    setDevRangeOnly,
    localhostOnly,
    setLocalhostOnly,
    filtered,
  } = usePortFilter(ports);
  const { killOne, killMany } = usePortActions(refresh);

  const { tcp, udp } = countByProtocol(ports);
  const localhost = countLocalhost(ports);

  return (
    <div className="flex h-screen flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold tracking-tight">Porty</span>
        <KillAllButton count={filtered.length} onConfirm={() => killMany(filtered)} />
      </div>

      <div className="flex flex-col gap-2 border-b border-border px-4 py-3">
        <SearchBar value={query} onChange={setQuery} />
        <div className="flex flex-wrap items-center gap-1.5">
          <StatPill
            label="ports"
            value={ports.length}
            active={protocol === "all" && !localhostOnly}
            onClick={() => {
              setProtocol("all");
              if (localhostOnly) setLocalhostOnly(false);
            }}
          />
          <StatPill
            label="TCP"
            value={tcp}
            dotClassName="bg-primary"
            active={protocol === "TCP"}
            onClick={() => setProtocol(protocol === "TCP" ? "all" : "TCP")}
          />
          <StatPill
            label="UDP"
            value={udp}
            dotClassName="bg-violet-400"
            active={protocol === "UDP"}
            onClick={() => setProtocol(protocol === "UDP" ? "all" : "UDP")}
          />
          <StatPill
            label="localhost"
            value={localhost}
            dotClassName="bg-sky-400"
            active={localhostOnly}
            onClick={() => setLocalhostOnly((prev) => !prev)}
          />
          <DevRangeToggle
            active={devRangeOnly}
            onToggle={() => setDevRangeOnly((prev) => !prev)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <PortTable ports={filtered} onKill={killOne} />
      </div>
      <Toaster />
    </div>
  );
}
