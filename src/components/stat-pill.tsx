import { cn } from "@/lib/utils";

interface StatPillProps {
  label: string;
  value: number;
  dotClassName?: string;
  active?: boolean;
  onClick?: () => void;
}

export function StatPill({
  label,
  value,
  dotClassName,
  active,
  onClick,
}: StatPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
        onClick && "cursor-pointer hover:bg-card",
        active
          ? "border-primary/40 bg-primary/15 text-foreground"
          : "border-border bg-card/60 text-muted-foreground",
      )}
    >
      {dotClassName && <span className={cn("size-1.5 rounded-full", dotClassName)} />}
      <span className="font-mono font-semibold tabular-nums text-foreground">
        {value}
      </span>
      <span>{label}</span>
    </button>
  );
}
