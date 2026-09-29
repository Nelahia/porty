export function isTrayPopoverRoute(): boolean {
  return new URLSearchParams(window.location.search).get("tray") === "1";
}
