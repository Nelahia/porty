use crate::models::{KillResult, PortInfo};
use crate::services::{port_service, process_service};

#[tauri::command]
pub fn list_ports() -> Result<Vec<PortInfo>, String> {
    port_service::list_open_ports()
}

#[tauri::command]
pub fn kill_process(pid: u32) -> KillResult {
    process_service::kill_process(pid)
}

#[tauri::command]
pub fn kill_processes(pids: Vec<u32>) -> Vec<KillResult> {
    process_service::kill_processes(pids)
}
