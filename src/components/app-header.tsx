import { Radar } from "lucide-react";
import { DevRangeToggle } from "@/components/dev-range-toggle";
import { KillAllButton } from "@/components/kill-all-button";
import { SearchBar } from "@/components/search-bar";
import { StatPill } from "@/components/stat-pill";
import { countByProtocol } from "@/helpers/count-by-protocol";
import { countLocalhost } from "@/helpers/count-localhost";
import type { PortInfo, Protocol } from "@/types/port";

interface AppHeaderProps {
  ports: PortInfo[];
  visibleCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  protocol: Protocol | "all";
  onProtocolChange: (protocol: Protocol | "all") => void;
  devRangeOnly: boolean;
  onDevRangeToggle: () => void;
  localhostOnly: boolean;
  onLocalhostToggle: () => void;
  onKillAll: () => void;
}

export function AppHeader({
  ports,
  visibleCount,
  query,
  onQueryChange,
  protocol,
  onProtocolChange,
  devRangeOnly,
  onDevRangeToggle,
  localhostOnly,
  onLocalhostToggle,
  onKillAll,
}: AppHeaderProps) {
  const { tcp, udp } = countByProtocol(ports);
  const localhost = countLocalhost(ports);

  return (
    <header className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <Radar className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Porty</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Live
            </div>
          </div>
        </div>
        <KillAllButton count={visibleCount} onConfirm={onKillAll} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatPill
            label="ports"
            value={ports.length}
            active={protocol === "all" && !localhostOnly}
            onClick={() => {
              onProtocolChange("all");
              if (localhostOnly) onLocalhostToggle();
            }}
          />
          <StatPill
            label="TCP"
            value={tcp}
            dotClassName="bg-primary"
            active={protocol === "TCP"}
            onClick={() =>
              onProtocolChange(protocol === "TCP" ? "all" : "TCP")
            }
          />
          <StatPill
            label="UDP"
            value={udp}
            dotClassName="bg-violet-400"
            active={protocol === "UDP"}
            onClick={() =>
              onProtocolChange(protocol === "UDP" ? "all" : "UDP")
            }
          />
          <StatPill
            label="localhost"
            value={localhost}
            dotClassName="bg-sky-400"
            active={localhostOnly}
            onClick={onLocalhostToggle}
          />
          <DevRangeToggle active={devRangeOnly} onToggle={onDevRangeToggle} />
        </div>
        <SearchBar value={query} onChange={onQueryChange} />
      </div>
    </header>
  );
}
