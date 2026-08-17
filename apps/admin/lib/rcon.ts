import { Rcon } from "rcon-client";

export interface RconCommandResult {
  success: boolean;
  response: string;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRconConfig() {
  const host = process.env.RCON_HOST;
  const port = process.env.RCON_PORT;
  const password = process.env.RCON_PASSWORD;

  if (!host || !port || !password) {
    return null;
  }

  return { host, port: Number(port), password };
}

/**
 * Esegue una lista di comandi in un'unica connessione RCON, con qualche
 * tentativo di riconnessione se il server è momentaneamente offline
 * (retry automatico richiesto dal brief §7). Ritorna un risultato per
 * comando, nello stesso ordine dell'input.
 */
export async function executeRconCommands(commands: string[]): Promise<RconCommandResult[]> {
  const config = getRconConfig();
  if (!config) {
    return commands.map(() => ({
      success: false,
      response: "RCON non configurato (vedi docs/SETUP.md)",
    }));
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const rcon = await Rcon.connect(config);
      try {
        const results: RconCommandResult[] = [];
        for (const command of commands) {
          const response = await rcon.send(command);
          results.push({ success: true, response });
        }
        return results;
      } finally {
        await rcon.end();
      }
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_ATTEMPTS) {
        await wait(RETRY_DELAY_MS);
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : "Errore di connessione RCON";
  return commands.map(() => ({ success: false, response: message }));
}
