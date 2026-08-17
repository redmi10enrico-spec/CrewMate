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

-- Shop: stesse categorie/prodotti che c'erano hardcoded nello scheletro.
insert into public.product_categories (name, slug, "order") values
  ('Ranghi', 'ranghi', 1),
  ('Kit', 'kit', 2),
  ('Cosmetici', 'cosmetici', 3)
on conflict (slug) do nothing;

with cat as (select id, slug from public.product_categories)
insert into public.products (category_id, name, description, price, featured, "order", enabled)
select cat.id, v.name, v.description, v.price, v.featured, v.ord, true
from (values
  ('ranghi', 'VIP', 'Il primo passo per sostenere il server.', 4.99, false, 1),
  ('ranghi', 'MVP', 'Il rango più scelto dalla community.', 9.99, true, 2),
  ('ranghi', 'ELITE', 'Il massimo dei vantaggi su CrewMate Network.', 19.99, false, 3),
  ('kit', 'Kit Guerriero', 'Tutto il necessario per il combattimento.', 2.99, false, 1),
  ('kit', 'Kit Minatore', 'Tutto il necessario per minare in profondità.', 2.99, false, 2),
  ('cosmetici', 'Pacchetto Particelle', 'Personalizza il tuo stile in gioco.', 3.99, false, 1)
) as v(cat_slug, name, description, price, featured, ord)
join cat on cat.slug = v.cat_slug
on conflict (name) do nothing;

with feat as (
  select p.id as product_id, f.text, f.ord
  from public.products p
  join (values
    ('VIP', 'Prefix [VIP] in chat', 1),
    ('VIP', '2 home extra', 2),
    ('VIP', 'Accesso a /kit vip', 3),
    ('MVP', 'Tutti i vantaggi VIP', 1),
    ('MVP', 'Prefix [MVP] colorato', 2),
    ('MVP', '5 home extra', 3),
    ('MVP', 'Effetti particellari', 4),
    ('ELITE', 'Tutti i vantaggi MVP', 1),
    ('ELITE', 'Prefix [ELITE] animato', 2),
    ('ELITE', 'Home illimitate', 3),
    ('ELITE', 'Accesso prioritario', 4),
    ('Kit Guerriero', 'Armatura in diamante', 1),
    ('Kit Guerriero', 'Spada incantata', 2),
    ('Kit Guerriero', 'Pozioni assortite', 3),
    ('Kit Minatore', 'Piccone Fortuna III', 1),
    ('Kit Minatore', 'Set completo di picconi', 2),
    ('Kit Minatore', 'Torce e cibo', 3),
    ('Pacchetto Particelle', '20+ effetti particellari', 1),
    ('Pacchetto Particelle', 'Scie personalizzate', 2),
    ('Pacchetto Particelle', 'Ali cosmetiche', 3)
  ) as f(product_name, text, ord) on f.product_name = p.name
)
insert into public.product_features (product_id, text, "order")
select product_id, text, ord from feat
on conflict (product_id, text) do nothing;

-- Comandi RCON eseguiti alla consegna (placeholder: adattali ai plugin
-- reali del server, es. LuckPerms per i ranghi).
with cmd as (
  select p.id as product_id, c.command, c.ord
  from public.products p
  join (values
    ('VIP', 'lp user {player} parent add vip', 1),
    ('MVP', 'lp user {player} parent add mvp', 1),
    ('ELITE', 'lp user {player} parent add elite', 1),
    ('Kit Guerriero', 'give {player} diamond_sword 1', 1),
    ('Kit Guerriero', 'give {player} diamond_chestplate 1', 2),
    ('Kit Minatore', 'give {player} diamond_pickaxe{Enchantments:[{id:fortune,lvl:3}]} 1', 1),
    ('Pacchetto Particelle', 'lp user {player} permission set crewmate.cosmetics.particles true', 1)
  ) as c(product_name, command, ord) on c.product_name = p.name
)
insert into public.product_commands (product_id, command, "order")
select product_id, command, ord from cmd
on conflict (product_id, command) do nothing;
