-- Contenuto di default per la Home, replica di quello che c'era
-- hardcoded nello scheletro statico. Applicalo dopo le migrazioni
-- (vedi docs/SETUP.md) cosi' il sito mostra subito qualcosa di
-- sensato; l'admin potra' modificarlo dal pannello (Fase 4+).

insert into public.site_settings (key, value) values
  ('site_name', '"CrewMate Network"'),
  ('server_ip', '"play.crewmate.net"'),
  ('discord_url', '"#"'),
  ('minecraft_version', '"1.20+"'),
  ('players_online', '"0"'),
  ('registered_users', '"0"'),
  ('uptime_label', '"24/7"'),
  ('hero_title', '"Benvenuto su CrewMate Network"'),
  ('hero_description', '"Il server Minecraft dove costruire, giocare e crescere insieme a una community appassionata. Unisciti a noi e inizia la tua avventura!"')
on conflict (key) do nothing;

-- L'icona è uno slug del registro in packages/ui/src/icons.ts (Lucide),
-- non un'emoji: l'admin lo sceglierà da un elenco nel pannello (Fase 4+).
insert into public.server_modes (name, slug, description, icon, "order", enabled) values
  ('Survival', 'survival', 'Sopravvivi, costruisci ed esplora un mondo persistente con economia e protezioni.', 'pickaxe', 1, true),
  ('SkyBlock', 'skyblock', 'Parti da un''isola nel vuoto e crea il tuo impero passo dopo passo.', 'mountain', 2, true),
  ('Minigames', 'minigames', 'Sfida gli altri giocatori in tante modalità competitive e frenetiche.', 'swords', 3, true)
on conflict (slug) do nothing;

insert into public.home_features (title, description, icon, "order", enabled) values
  ('Anti-Cheat', 'Protezione avanzata contro cheater e griefer.', 'shield-check', 1, true),
  ('Community', 'Staff attivo e giocatori accoglienti.', 'users', 2, true),
  ('Performance', 'Hardware potente per zero lag.', 'zap', 3, true),
  ('Eventi', 'Eventi settimanali con premi esclusivi.', 'gift', 4, true)
on conflict (title) do nothing;
