const REGISTERED_RANGE_START = 1024;
const REGISTERED_RANGE_END = 49151;

/**
 * Plage IANA des "registered ports" : là où vivent quasiment tous les
 * services locaux (Postgres, Docker, Node, Spotify, OBS...). Exclut les
 * ports système (<1024) et la plage éphémère/dynamique (>49151), où les
 * clients OS et certaines apps (ex: League of Legends) prennent un port
 * aléatoire à chaque lancement.
 */
export function isRegisteredPort(port: number): boolean {
  return port >= REGISTERED_RANGE_START && port <= REGISTERED_RANGE_END;
}
