use tauri::{
    AppHandle, LogicalSize, Manager, PhysicalPosition, Position, Size, WebviewUrl, WebviewWindow,
    WebviewWindowBuilder,
};

pub const LABEL: &str = "tray-popover";
const WIDTH: f64 = 380.0;
const HEIGHT: f64 = 560.0;
const SCREEN_MARGIN: f64 = 8.0;

/// Shows/hides the on-brand floating popover anchored near the tray icon,
/// instead of relying on the native (unstyleable) OS context menu.
pub fn toggle(app: &AppHandle, cursor: PhysicalPosition<f64>) {
    if let Some(window) = app.get_webview_window(LABEL) {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            position_near_cursor(&window, cursor);
            let _ = window.show();
            let _ = window.set_focus();
        }
        return;
    }

    if let Ok(window) = create(app) {
        position_near_cursor(&window, cursor);
        let _ = window.show();
        let _ = window.set_focus();
        hide_on_blur(&window);
    }
}

fn create(app: &AppHandle) -> tauri::Result<WebviewWindow> {
    WebviewWindowBuilder::new(app, LABEL, WebviewUrl::App("index.html?tray=1".into()))
        .title("Porty")
        .inner_size(WIDTH, HEIGHT)
        .resizable(false)
        .decorations(false)
        .transparent(true)
        .shadow(true)
        .always_on_top(true)
        .skip_taskbar(true)
        .visible(false)
        .build()
}

fn hide_on_blur(window: &WebviewWindow) {
    let window_to_hide = window.clone();
    window.on_window_event(move |event| {
        if let tauri::WindowEvent::Focused(false) = event {
            let _ = window_to_hide.hide();
        }
    });
}

/// macOS: menu bar lives at the top, so the popover opens downward from the
/// click point. Windows: the tray lives in the bottom-right, so it opens
/// upward instead.
fn position_near_cursor(window: &WebviewWindow, cursor: PhysicalPosition<f64>) {
    let scale = window.scale_factor().unwrap_or(1.0);
    let physical_size: tauri::PhysicalSize<f64> = Size::Logical(LogicalSize {
        width: WIDTH,
        height: HEIGHT,
    })
    .to_physical(scale);

    let y = if cfg!(target_os = "macos") {
        cursor.y + SCREEN_MARGIN
    } else {
        cursor.y - physical_size.height - SCREEN_MARGIN
    };
    let x = cursor.x - physical_size.width / 2.0;

    let _ = window.set_position(Position::Physical(PhysicalPosition {
        x: x as i32,
        y: y as i32,
    }));
}
