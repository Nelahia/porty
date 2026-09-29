use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PortInfo {
    pub port: u16,
    pub pid: u32,
    pub process_name: String,
    pub protocol: String,
    pub state: String,
    /// Adresse d'écoute normalisée pour l'affichage : "localhost",
    /// "toutes interfaces", ou l'IP brute pour les cas particuliers.
    pub address: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct KillResult {
    pub pid: u32,
    pub success: bool,
    pub error: Option<String>,
}
