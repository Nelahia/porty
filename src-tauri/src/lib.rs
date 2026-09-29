mod commands;
mod models;
mod services;
mod tray;

use commands::ports::{kill_process, kill_processes, list_ports};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            tray::init(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_ports,
            kill_process,
            kill_processes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
