import {
  Gift,
  HelpCircle,
  type LucideIcon,
  Mountain,
  Pickaxe,
  ShieldCheck,
  Swords,
  Users,
  Zap,
} from "lucide-react";

// Registro di icone per i campi `icon` (testo libero) delle tabelle
// editabili dall'admin — server_modes, home_features e, nelle fasi
// successive, product_categories/forum_categories/ecc. L'admin sceglierà
// uno di questi slug invece di incollare un'emoji.
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  pickaxe: Pickaxe,
  mountain: Mountain,
  swords: Swords,
  "shield-check": ShieldCheck,
  users: Users,
  zap: Zap,
  gift: Gift,
};

export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) {
    return HelpCircle;
  }
  return ICON_REGISTRY[name] ?? HelpCircle;
}
