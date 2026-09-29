import { getCurrentWindow } from "@tauri-apps/api/window";
import { Copy, Minus, Square, X } from "lucide-react";
import { isMacPlatform } from "@/helpers/get-platform";
import { useWindowMaximized } from "@/hooks/use-window-maximized";

const appWindow = getCurrentWindow();

const BUTTON_CLASS =
  "inline-flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground";

export function TitleBar() {
  const isMaximized = useWindowMaximized();
  const isMac = isMacPlatform();

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-9 select-none items-center">
      <div
        data-tauri-drag-region=""
        className={isMac ? "h-full flex-1 pl-20" : "h-full flex-1"}
      />
      {!isMac && (
        <div className="flex h-full shrink-0">
          <button
            type="button"
            aria-label="Minimize"
            onClick={() => appWindow.minimize()}
            className={BUTTON_CLASS}
          >
            <Minus className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onClick={() => appWindow.toggleMaximize()}
            className={BUTTON_CLASS}
          >
            {isMaximized ? (
              <Copy className="size-3" />
            ) : (
              <Square className="size-3" />
            )}
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={() => appWindow.close()}
            className="inline-flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
