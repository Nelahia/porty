import { Code2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DevRangeToggleProps {
  active: boolean;
  onToggle: () => void;
}

export function DevRangeToggle({ active, onToggle }: DevRangeToggleProps) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "outline"}
      size="sm"
      onClick={onToggle}
      className="gap-1.5"
    >
      {active ? (
        <Code2 className="size-3.5" />
      ) : (
        <Globe className="size-3.5" />
      )}
      {active ? "Dev ports" : "All ports"}
    </Button>
  );
}
