-- Fase 7: candidature dinamiche (form configurabili dall'admin, domande,
-- candidature ricevute e risposte).

create type public.question_type as enum ('text', 'textarea', 'number', 'select', 'radio', 'checkbox');
create type public.application_status as enum ('pending', 'interview', 'accepted', 'rejected');

create table public.application_forms (
  id uuid primary key default gen_random_uuid(),
  role_name text not null,
  slug text not null unique,
  description text not null default '',
  enabled boolean not null default true,
  is_open boolean not null default true,
  "order" integer not null default 0
);

create table public.application_questions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.application_forms (id) on delete cascade,
  label text not null,
  type public.question_type not null default 'text',
  options jsonb,
  required boolean not null default true,
  placeholder text,
  hint text,
  "order" integer not null default 0
);

create index application_questions_form_id_idx on public.application_questions (form_id);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.application_forms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.application_status not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  notes text,
  unique (form_id, user_id)
);

create index applications_user_id_idx on public.applications (user_id);

create table public.application_answers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  question_id uuid not null references public.application_questions (id) on delete cascade,
  value text not null default '',
  unique (application_id, question_id)
);

create index application_answers_application_id_idx on public.application_answers (application_id);

alter table public.application_forms enable row level security;
alter table public.application_questions enable row level security;
alter table public.applications enable row level security;
alter table public.application_answers enable row level security;

create policy "application_forms_select_enabled"
  on public.application_forms for select
  to public
  using (enabled = true);

create policy "application_questions_select_public"
  on public.application_questions for select
  to public
  using (true);

-- applications: l'utente vede e crea solo le proprie, sempre in stato
-- 'pending' (le transizioni successive sono riservate al service role,
-- dalla revisione admin). Il vincolo unique (form_id, user_id) impedisce
-- candidature doppie allo stesso ruolo.
create policy "applications_select_own"
  on public.applications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "applications_insert_own_pending"
  on public.applications for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'pending');

create policy "application_answers_select_own"
  on public.application_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.applications
      where applications.id = application_answers.application_id
        and applications.user_id = auth.uid()
    )
  );

create policy "application_answers_insert_own"
  on public.application_answers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.applications
      where applications.id = application_answers.application_id
        and applications.user_id = auth.uid()
    )
  );
