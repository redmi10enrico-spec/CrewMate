import {
  Flame,
  Gavel,
  Gift,
  Hammer,
  HelpCircle,
  type LucideIcon,
  Megaphone,
  MessageCircle,
  Mountain,
  Pickaxe,
  ShieldCheck,
  Swords,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

// Registro di icone per i campi `icon` (testo libero) delle tabelle
// editabili dall'admin — server_modes, home_features,
// forum_categories/ecc. L'admin sceglierà uno di questi slug invece di
// incollare un'emoji.
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  pickaxe: Pickaxe,
  mountain: Mountain,
  swords: Swords,
  "shield-check": ShieldCheck,
  users: Users,
  zap: Zap,
  gift: Gift,
  megaphone: Megaphone,
  "message-circle": MessageCircle,
  wrench: Wrench,
  hammer: Hammer,
  gavel: Gavel,
  flame: Flame,
};

export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) {
    return HelpCircle;
  }
  return ICON_REGISTRY[name] ?? HelpCircle;
}
