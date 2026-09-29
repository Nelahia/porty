use crate::models::KillResult;
use std::collections::HashSet;

/// PID qu'on ne tue jamais, même sur demande explicite de "tout tuer" :
/// Porty lui-même, et les process système critiques (PID 0, PID 4 = "System"
/// sur Windows).
fn protected_pids() -> HashSet<u32> {
    let mut protected = HashSet::from([0, std::process::id()]);
    if cfg!(target_os = "windows") {
        protected.insert(4);
    }
    protected
}

#[cfg(target_os = "windows")]
mod platform {
    use windows_sys::Win32::Foundation::{CloseHandle, GetLastError, ERROR_INVALID_PARAMETER};
    use windows_sys::Win32::System::Threading::{
        OpenProcess, TerminateProcess, PROCESS_TERMINATE,
    };

    fn describe_win32_error(code: u32) -> String {
        match code {
            5 => "access denied (the process likely runs with higher \
                  privileges than Porty)"
                .to_string(),
            code if code == ERROR_INVALID_PARAMETER => {
                "process not found (already stopped?)".to_string()
            }
            code => format!("Windows error {code}"),
        }
    }

    pub fn kill(pid: u32) -> Result<(), String> {
        unsafe {
            let handle = OpenProcess(PROCESS_TERMINATE, 0, pid);
            if handle.is_null() {
                return Err(describe_win32_error(GetLastError()));
            }

            let terminated = TerminateProcess(handle, 1);
            let error_code = if terminated == 0 {
                Some(GetLastError())
            } else {
                None
            };
            CloseHandle(handle);

            match error_code {
                None => Ok(()),
                Some(code) => Err(describe_win32_error(code)),
            }
        }
    }
}

#[cfg(not(target_os = "windows"))]
mod platform {
    use sysinfo::{Pid, ProcessesToUpdate, System};

    pub fn kill(pid: u32) -> Result<(), String> {
        let mut system = System::new();
        system.refresh_processes(ProcessesToUpdate::All, true);
        match system.process(Pid::from_u32(pid)) {
            Some(process) if process.kill() => Ok(()),
            Some(_) => Err("failed to stop the process".to_string()),
            None => Err("process not found (already stopped?)".to_string()),
        }
    }
}

fn kill_one(pid: u32, protected: &HashSet<u32>) -> KillResult {
    if protected.contains(&pid) {
        return KillResult {
            pid,
            success: false,
            error: Some("protected process".to_string()),
        };
    }

    match platform::kill(pid) {
        Ok(()) => KillResult {
            pid,
            success: true,
            error: None,
        },
        Err(error) => KillResult {
            pid,
            success: false,
            error: Some(error),
        },
    }
}

pub fn kill_process(pid: u32) -> KillResult {
    kill_one(pid, &protected_pids())
}

pub fn kill_processes(pids: Vec<u32>) -> Vec<KillResult> {
    let protected = protected_pids();
    pids.into_iter().map(|pid| kill_one(pid, &protected)).collect()
}
