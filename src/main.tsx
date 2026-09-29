import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TrayPopover } from "@/components/tray-popover";
import { isTrayPopoverRoute } from "@/helpers/is-tray-popover";
import "./index.css";

const isTrayPopover = isTrayPopoverRoute();

if (isTrayPopover) {
  document.documentElement.style.background = "transparent";
  document.body.style.background = "transparent";
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>{isTrayPopover ? <TrayPopover /> : <App />}</React.StrictMode>,
);
