import { AppHeader } from "@/components/app-header";
import { PortTable } from "@/components/port-table";
import { TitleBar } from "@/components/title-bar";
import { Toaster } from "@/components/ui/sonner";
import { usePortActions } from "@/hooks/use-port-actions";
import { usePortFilter } from "@/hooks/use-port-filter";
import { usePorts } from "@/hooks/use-ports";

function App() {
  const { ports, error, refresh } = usePorts();
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <TitleBar />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/20%),transparent_70%)]"
      />
      <main className="relative mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-8 pt-16 pb-8">
        <AppHeader
          ports={ports}
          visibleCount={filtered.length}
          query={query}
          onQueryChange={setQuery}
          protocol={protocol}
          onProtocolChange={setProtocol}
          devRangeOnly={devRangeOnly}
          onDevRangeToggle={() => setDevRangeOnly((prev) => !prev)}
          localhostOnly={localhostOnly}
          onLocalhostToggle={() => setLocalhostOnly((prev) => !prev)}
          onKillAll={() => killMany(filtered)}
        />
        {error && (
          <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <PortTable ports={filtered} onKill={killOne} />
      </main>
      <Toaster />
    </div>
  );
}

export default App;
