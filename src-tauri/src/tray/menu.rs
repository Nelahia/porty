use crate::models::PortInfo;
use crate::services::port_service;
use std::ops::RangeInclusive;
use tauri::menu::{IsMenuItem, Menu, MenuItem, PredefinedMenuItem};
use tauri::{AppHandle, Wry};

/// Même plage "registered ports" que le filtre "Dev ports" du frontend, pour
/// que le tray ne propose jamais de tuer autre chose que des services locaux.
const REGISTERED_RANGE: RangeInclusive<u16> = 1024..=49151;
const MAX_VISIBLE_PORTS: usize = 15;

pub fn dev_ports() -> Vec<PortInfo> {
    port_service::list_open_ports()
        .unwrap_or_default()
        .into_iter()
        .filter(|p| REGISTERED_RANGE.contains(&p.port))
        .collect()
}

pub fn build(app: &AppHandle) -> tauri::Result<Menu<Wry>> {
    let ports = dev_ports();

    let header_text = match ports.len() {
        0 => "No dev port listening".to_string(),
        1 => "1 dev port listening".to_string(),
        n => format!("{n} dev ports listening"),
    };
    let header = MenuItem::with_id(app, "header", header_text, false, None::<&str>)?;
    let sep_top = PredefinedMenuItem::separator(app)?;
    let sep_mid = PredefinedMenuItem::separator(app)?;
    let sep_bottom = PredefinedMenuItem::separator(app)?;

    let port_items = ports
        .iter()
        .take(MAX_VISIBLE_PORTS)
        .map(|p| {
            MenuItem::with_id(
                app,
                format!("kill:{}", p.pid),
                format!("{}  ·  {} ({})", p.port, p.process_name, p.pid),
                true,
                None::<&str>,
            )
        })
        .collect::<tauri::Result<Vec<_>>>()?;

    let more_item = if ports.len() > MAX_VISIBLE_PORTS {
        Some(MenuItem::with_id(
            app,
            "more",
            format!("+{} more — open Porty", ports.len() - MAX_VISIBLE_PORTS),
            false,
            None::<&str>,
        )?)
    } else {
        None
    };

    let kill_all_item = MenuItem::with_id(
        app,
        "kill-all",
        "Kill all dev ports",
        !ports.is_empty(),
        None::<&str>,
    )?;
    let show_item = MenuItem::with_id(app, "show", "Show Porty", true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    let mut items: Vec<&dyn IsMenuItem<Wry>> = vec![&header, &sep_top];
    items.extend(port_items.iter().map(|i| i as &dyn IsMenuItem<Wry>));
    if let Some(item) = &more_item {
        items.push(item);
    }
    items.push(&sep_mid);
    items.push(&kill_all_item);
    items.push(&sep_bottom);
    items.push(&show_item);
    items.push(&quit_item);

    Menu::with_items(app, &items)
}
