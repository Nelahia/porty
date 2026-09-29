mod menu;
mod popover;

use crate::services::process_service;
use std::time::Duration;
use tauri::menu::MenuEvent;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Manager};

const TRAY_ID: &str = "main-tray";
const REFRESH_INTERVAL: Duration = Duration::from_secs(4);

/// Crée l'icône de tray/menu bar. Clic gauche : popover custom au style de
/// l'app (liste des ports + filtres + kill). Clic droit : menu natif de
/// secours (liste des ports, kill all, show, quit). Fermer la fenêtre
/// principale la cache dans le tray plutôt que de quitter l'app.
pub fn init(app: &AppHandle) -> tauri::Result<()> {
    let initial_menu = menu::build(app)?;

    TrayIconBuilder::with_id(TRAY_ID)
        .icon(app.default_window_icon().cloned().unwrap())
        .menu(&initial_menu)
        .show_menu_on_left_click(false)
        .on_menu_event(handle_menu_event)
        .on_tray_icon_event(handle_tray_icon_event)
        .build(app)?;

    spawn_menu_refresh(app.clone());
    hide_instead_of_close(app);

    Ok(())
}

fn handle_tray_icon_event(tray: &tauri::tray::TrayIcon, event: TrayIconEvent) {
    if let TrayIconEvent::Click {
        button: MouseButton::Left,
        button_state: MouseButtonState::Up,
        position,
        ..
    } = event
    {
        popover::toggle(tray.app_handle(), position);
    }
}

fn spawn_menu_refresh(app: AppHandle) {
    std::thread::spawn(move || loop {
        std::thread::sleep(REFRESH_INTERVAL);
        if let (Ok(fresh_menu), Some(tray)) = (menu::build(&app), app.tray_by_id(TRAY_ID)) {
            let _ = tray.set_menu(Some(fresh_menu));
        }
    });
}

fn hide_instead_of_close(app: &AppHandle) {
    let Some(window) = app.get_webview_window("main") else {
        return;
    };
    let window_to_hide = window.clone();
    window.on_window_event(move |event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            let _ = window_to_hide.hide();
        }
    });
}

fn handle_menu_event(app: &AppHandle, event: MenuEvent) {
    let id = event.id().as_ref();

    match id {
        "quit" => app.exit(0),
        "show" => show_main_window(app),
        "kill-all" => {
            let pids = menu::dev_ports().into_iter().map(|p| p.pid).collect();
            process_service::kill_processes(pids);
        }
        id => {
            if let Some(pid) = id.strip_prefix("kill:").and_then(|s| s.parse().ok()) {
                process_service::kill_process(pid);
            }
        }
    }
}

fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}
