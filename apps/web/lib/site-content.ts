import { createSupabaseClient, getEnabledHomeFeatures, getEnabledServerModes, getSiteSettings } from "@crewmate/db";
import type { HomeFeatureRow, ServerModeRow } from "@crewmate/db";

export interface SiteSettings {
  site_name: string;
  server_ip: string;
  discord_url: string;
  minecraft_version: string;
  players_online: string;
  registered_users: string;
  uptime_label: string;
  hero_title: string;
  hero_description: string;
}

export interface ServerModeContent {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface HomeFeatureContent {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HomeContent {
  settings: SiteSettings;
  serverModes: ServerModeContent[];
  homeFeatures: HomeFeatureContent[];
}

// Replica il contenuto dello scheletro statico originale: usato finché non
// esiste un progetto Supabase reale (vedi docs/SETUP.md) o se una query
// fallisce, cosi' il sito resta sempre navigabile.
const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "CrewMate Network",
  server_ip: "play.crewmate.net",
  discord_url: "#",
  minecraft_version: "1.20+",
  players_online: "0",
  registered_users: "0",
  uptime_label: "24/7",
  hero_title: "Benvenuto su CrewMate Network",
  hero_description:
    "Il server Minecraft dove costruire, giocare e crescere insieme a una community appassionata. Unisciti a noi e inizia la tua avventura!",
};

const DEFAULT_SERVER_MODES: ServerModeContent[] = [
  {
    id: "default-survival",
    name: "Survival",
    slug: "survival",
    description: "Sopravvivi, costruisci ed esplora un mondo persistente con economia e protezioni.",
    icon: "pickaxe",
  },
  {
    id: "default-skyblock",
    name: "SkyBlock",
    slug: "skyblock",
    description: "Parti da un'isola nel vuoto e crea il tuo impero passo dopo passo.",
    icon: "mountain",
  },
  {
    id: "default-minigames",
    name: "Minigames",
    slug: "minigames",
    description: "Sfida gli altri giocatori in tante modalità competitive e frenetiche.",
    icon: "swords",
  },
];

const DEFAULT_HOME_FEATURES: HomeFeatureContent[] = [
  { id: "default-anti-cheat", title: "Anti-Cheat", description: "Protezione avanzata contro cheater e griefer.", icon: "shield-check" },
  { id: "default-community", title: "Community", description: "Staff attivo e giocatori accoglienti.", icon: "users" },
  { id: "default-performance", title: "Performance", description: "Hardware potente per zero lag.", icon: "zap" },
  { id: "default-eventi", title: "Eventi", description: "Eventi settimanali con premi esclusivi.", icon: "gift" },
];

const DEFAULT_HOME_CONTENT: HomeContent = {
  settings: DEFAULT_SETTINGS,
  serverModes: DEFAULT_SERVER_MODES,
  homeFeatures: DEFAULT_HOME_FEATURES,
};

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function mergeSettings(raw: Record<string, unknown>): SiteSettings {
  const merged = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
    const value = raw[key];
    if (typeof value === "string" && value.length > 0) {
      merged[key] = value;
    }
  }
  return merged;
}

function mapServerMode(row: ServerModeRow): ServerModeContent {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description, icon: row.icon };
}

function mapHomeFeature(row: HomeFeatureRow): HomeFeatureContent {
  return { id: row.id, title: row.title, description: row.description, icon: row.icon };
}

// Usata dal layout (Header/Footer) su ogni pagina, separata da
// getHomeContent perché non serve caricare modalità/feature altrove.
export async function getPublicSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_SETTINGS;
  }

  try {
    const client = createSupabaseClient({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });
    return mergeSettings(await getSiteSettings(client));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getHomeContent(): Promise<HomeContent> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_HOME_CONTENT;
  }

  try {
    const client = createSupabaseClient({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });

    const [rawSettings, serverModes, homeFeatures] = await Promise.all([
      getSiteSettings(client),
      getEnabledServerModes(client),
      getEnabledHomeFeatures(client),
    ]);

    return {
      settings: mergeSettings(rawSettings),
      serverModes: serverModes.length > 0 ? serverModes.map(mapServerMode) : DEFAULT_SERVER_MODES,
      homeFeatures: homeFeatures.length > 0 ? homeFeatures.map(mapHomeFeature) : DEFAULT_HOME_FEATURES,
    };
  } catch {
    return DEFAULT_HOME_CONTENT;
  }
}
