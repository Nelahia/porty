use crate::models::PortInfo;
use listeners::{Protocol, SocketState};
use std::net::IpAddr;

/// Normalise l'IP d'écoute en libellé lisible, et donne un rang de tri pour
/// regrouper les ports locaux (loopback / toutes interfaces, où vivent
/// quasiment tous les serveurs de dev) avant le reste.
fn describe_address(ip: IpAddr) -> (String, u8) {
    if ip.is_loopback() {
        ("localhost".to_string(), 0)
    } else if ip.is_unspecified() {
        ("all interfaces".to_string(), 0)
    } else {
        (ip.to_string(), 1)
    }
}

/// Liste les ports actuellement en écoute (LISTEN) sur la machine, avec le
/// process associé. Les connexions établies/sortantes sont volontairement
/// exclues : ce n'est pas ce qu'on entend par "port utilisé" et ça éviterait
/// que "tout tuer" ne flingue des connexions réseau sans rapport.
pub fn list_open_ports() -> Result<Vec<PortInfo>, String> {
    let raw = listeners::get_all().map_err(|e| e.to_string())?;

    let mut ports: Vec<(u8, PortInfo)> = raw
        .into_iter()
        .filter(|l| l.state == SocketState::Listen)
        .map(|l| {
            let (address, group_rank) = describe_address(l.socket.ip());
            (
                group_rank,
                PortInfo {
                    port: l.socket.port(),
                    pid: l.process.pid,
                    process_name: l.process.name,
                    protocol: match l.protocol {
                        Protocol::TCP => "TCP".to_string(),
                        Protocol::UDP => "UDP".to_string(),
                    },
                    state: l.state.to_string(),
                    address,
                },
            )
        })
        .collect();

    ports.sort_by(|(rank_a, a), (rank_b, b)| rank_a.cmp(rank_b).then(a.port.cmp(&b.port)));
    ports.dedup_by(|(_, a), (_, b)| a.port == b.port && a.pid == b.pid && a.protocol == b.protocol);

    Ok(ports.into_iter().map(|(_, p)| p).collect())
}
