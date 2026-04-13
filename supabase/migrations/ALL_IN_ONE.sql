-- =====================================================================
-- JusFlow — Migration única idempotente
-- Schema dedicado `jusflow` para isolar de outros projetos no mesmo Supabase.
--
-- IMPORTANTE: Depois de rodar este SQL, vá em:
--   Supabase Dashboard → Project Settings → API → Exposed schemas
--   Adicionar: jusflow
-- Isso é obrigatório para o PostgREST expor as tabelas.
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create schema if not exists jusflow;
grant usage on schema jusflow to anon, authenticated;
alter default privileges in schema jusflow grant all on tables to anon, authenticated;
alter default privileges in schema jusflow grant all on sequences to anon, authenticated;

-- =========================================================
-- TABELAS
-- =========================================================

create table if not exists jusflow.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  plan text not null default 'free' check (plan in ('free','pro','team')),
  created_at timestamptz not null default now()
);

create table if not exists jusflow.members (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references jusflow.organizations(id) on delete cascade,
  role text not null default 'lawyer' check (role in ('owner','admin','lawyer','assistant')),
  created_at timestamptz not null default now(),
  unique(user_id, organization_id)
);
create index if not exists idx_jf_members_user on jusflow.members(user_id);
create index if not exists idx_jf_members_org on jusflow.members(organization_id);

create table if not exists jusflow.clients (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references jusflow.organizations(id) on delete cascade,
  type text not null check (type in ('pf','pj')),
  name text not null,
  document text,
  email text,
  phone text,
  address text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_jf_clients_org on jusflow.clients(organization_id, created_at desc);

create table if not exists jusflow.cases (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references jusflow.organizations(id) on delete cascade,
  client_id uuid references jusflow.clients(id) on delete set null,
  cnj_number text,
  title text not null,
  court text,
  area text,
  status text not null default 'active' check (status in ('active','archived','won','lost','settled')),
  opposing_party text,
  value_cents bigint default 0,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_jf_cases_org on jusflow.cases(organization_id, created_at desc);
create index if not exists idx_jf_cases_client on jusflow.cases(client_id);

create table if not exists jusflow.case_movements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references jusflow.organizations(id) on delete cascade,
  case_id uuid not null references jusflow.cases(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  description text not null,
  source text default 'manual',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists idx_jf_mov_case on jusflow.case_movements(case_id);

create table if not exists jusflow.events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references jusflow.organizations(id) on delete cascade,
  case_id uuid references jusflow.cases(id) on delete cascade,
  title text not null,
  kind text not null default 'deadline' check (kind in ('deadline','hearing','meeting','task')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  done boolean not null default false,
  notes text,
  priority text not null default 'normal' check (priority in ('low','normal','high','critical')),
  is_legal_deadline boolean not null default false,
  deadline_type text,
  business_days_only boolean not null default true,
  source_date date,
  fulfilled_at timestamptz,
  fulfilled_by uuid references auth.users(id),
  reminder_days int[] default array[7,3,1],
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists idx_jf_events_org_start on jusflow.events(organization_id, starts_at);
create index if not exists idx_jf_events_legal on jusflow.events(organization_id, starts_at)
  where is_legal_deadline = true and done = false;

create table if not exists jusflow.finance_entries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references jusflow.organizations(id) on delete cascade,
  case_id uuid references jusflow.cases(id) on delete set null,
  client_id uuid references jusflow.clients(id) on delete set null,
  kind text not null check (kind in ('income','expense')),
  amount_cents bigint not null,
  description text not null,
  due_date date,
  paid_at date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists idx_jf_fin_org on jusflow.finance_entries(organization_id, created_at desc);

create table if not exists jusflow.audit_log (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid,
  user_id uuid,
  action text not null,
  entity text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_jf_audit_org on jusflow.audit_log(organization_id, created_at desc);

create table if not exists jusflow.holidays (
  date date primary key,
  name text not null,
  scope text not null default 'national',
  tribunal text,
  type text default 'national' check (type in ('national','state','municipal','forensic')),
  year int
);
create index if not exists idx_jf_holidays_year on jusflow.holidays(year);

create table if not exists jusflow.forensic_recess (
  start_date date not null,
  end_date date not null,
  primary key (start_date, end_date)
);

create table if not exists jusflow.cnj_segments (
  code char(1) primary key,
  name text not null
);

create table if not exists jusflow.lgpd_consents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references jusflow.organizations(id) on delete cascade,
  terms_version text not null,
  privacy_version text not null,
  accepted_at timestamptz not null default now(),
  ip inet,
  user_agent text,
  constraint lgpd_consents_user_version_uq unique (user_id, terms_version)
);

-- =========================================================
-- SEED: feriados nacionais 2026/2027 + recesso + segmentos
-- =========================================================

insert into jusflow.holidays (date, name, year) values
  ('2026-01-01','Confraternização Universal',2026),
  ('2026-02-16','Carnaval',2026),
  ('2026-02-17','Carnaval',2026),
  ('2026-04-03','Sexta-feira Santa',2026),
  ('2026-04-21','Tiradentes',2026),
  ('2026-05-01','Dia do Trabalho',2026),
  ('2026-06-04','Corpus Christi',2026),
  ('2026-09-07','Independência',2026),
  ('2026-10-12','Nossa Senhora Aparecida',2026),
  ('2026-11-02','Finados',2026),
  ('2026-11-15','Proclamação da República',2026),
  ('2026-11-20','Consciência Negra',2026),
  ('2026-12-25','Natal',2026),
  ('2027-01-01','Confraternização Universal',2027)
on conflict (date) do nothing;

insert into jusflow.forensic_recess values
  ('2025-12-20','2026-01-20'),
  ('2026-12-20','2027-01-20')
on conflict do nothing;

insert into jusflow.cnj_segments values
  ('1','Supremo Tribunal Federal'),
  ('2','Conselho Nacional de Justiça'),
  ('3','Superior Tribunal de Justiça'),
  ('4','Justiça Federal'),
  ('5','Justiça do Trabalho'),
  ('6','Justiça Eleitoral'),
  ('7','Justiça Militar da União'),
  ('8','Justiça dos Estados e do DF'),
  ('9','Justiça Militar Estadual')
on conflict do nothing;

-- =========================================================
-- FUNÇÕES (SECURITY DEFINER com search_path fixo)
-- =========================================================

create or replace function jusflow.current_org_id() returns uuid
language sql stable security definer
set search_path = jusflow, public, pg_temp
as $$
  select organization_id from jusflow.members where user_id = auth.uid() limit 1;
$$;

create or replace function jusflow.is_org_member(org uuid) returns boolean
language sql stable security definer
set search_path = jusflow, public, pg_temp
as $$
  select exists(
    select 1 from jusflow.members
    where user_id = auth.uid() and organization_id = org
  );
$$;

create or replace function jusflow.handle_new_user() returns trigger
language plpgsql security definer
set search_path = jusflow, public, pg_temp
as $$
declare new_org_id uuid;
begin
  insert into jusflow.organizations (name)
    values (coalesce(nullif(new.raw_user_meta_data->>'org_name',''), 'Meu Escritório'))
    returning id into new_org_id;
  insert into jusflow.members (user_id, organization_id, role)
    values (new.id, new_org_id, 'owner');
  return new;
end; $$;

create or replace function jusflow.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- Trigger de signup
drop trigger if exists jf_on_auth_user_created on auth.users;
create trigger jf_on_auth_user_created after insert on auth.users
  for each row execute function jusflow.handle_new_user();

-- updated_at triggers
drop trigger if exists jf_trg_clients_updated on jusflow.clients;
create trigger jf_trg_clients_updated before update on jusflow.clients
  for each row execute function jusflow.touch_updated_at();

drop trigger if exists jf_trg_cases_updated on jusflow.cases;
create trigger jf_trg_cases_updated before update on jusflow.cases
  for each row execute function jusflow.touch_updated_at();

-- =========================================================
-- RLS
-- =========================================================

alter table jusflow.organizations    enable row level security;
alter table jusflow.members          enable row level security;
alter table jusflow.clients          enable row level security;
alter table jusflow.cases            enable row level security;
alter table jusflow.case_movements   enable row level security;
alter table jusflow.events           enable row level security;
alter table jusflow.finance_entries  enable row level security;
alter table jusflow.audit_log        enable row level security;
alter table jusflow.holidays         enable row level security;
alter table jusflow.forensic_recess  enable row level security;
alter table jusflow.cnj_segments     enable row level security;
alter table jusflow.lgpd_consents    enable row level security;

-- Drop policies antigas (idempotente)
drop policy if exists org_select on jusflow.organizations;
drop policy if exists org_update on jusflow.organizations;
drop policy if exists members_select on jusflow.members;
drop policy if exists members_insert on jusflow.members;
drop policy if exists members_delete on jusflow.members;
drop policy if exists clients_all on jusflow.clients;
drop policy if exists cases_all on jusflow.cases;
drop policy if exists movements_all on jusflow.case_movements;
drop policy if exists events_all on jusflow.events;
drop policy if exists finance_all on jusflow.finance_entries;
drop policy if exists audit_select on jusflow.audit_log;
drop policy if exists audit_insert on jusflow.audit_log;
drop policy if exists holidays_read on jusflow.holidays;
drop policy if exists recess_read on jusflow.forensic_recess;
drop policy if exists segments_read on jusflow.cnj_segments;
drop policy if exists lgpd_read on jusflow.lgpd_consents;
drop policy if exists lgpd_insert on jusflow.lgpd_consents;

create policy org_select on jusflow.organizations for select
  using (jusflow.is_org_member(id));
create policy org_update on jusflow.organizations for update
  using (exists(
    select 1 from jusflow.members
    where user_id = auth.uid() and organization_id = organizations.id
      and role in ('owner','admin')
  ));

create policy members_select on jusflow.members for select
  using (jusflow.is_org_member(organization_id));
create policy members_insert on jusflow.members for insert
  with check (exists(
    select 1 from jusflow.members m
    where m.user_id = auth.uid()
      and m.organization_id = members.organization_id
      and m.role in ('owner','admin')
  ));
create policy members_delete on jusflow.members for delete
  using (exists(
    select 1 from jusflow.members m
    where m.user_id = auth.uid()
      and m.organization_id = members.organization_id
      and m.role in ('owner','admin')
  ));

create policy clients_all on jusflow.clients for all
  using (jusflow.is_org_member(organization_id))
  with check (jusflow.is_org_member(organization_id));

create policy cases_all on jusflow.cases for all
  using (jusflow.is_org_member(organization_id))
  with check (jusflow.is_org_member(organization_id));

create policy movements_all on jusflow.case_movements for all
  using (jusflow.is_org_member(organization_id))
  with check (jusflow.is_org_member(organization_id));

create policy events_all on jusflow.events for all
  using (jusflow.is_org_member(organization_id))
  with check (jusflow.is_org_member(organization_id));

create policy finance_all on jusflow.finance_entries for all
  using (jusflow.is_org_member(organization_id))
  with check (jusflow.is_org_member(organization_id));

create policy audit_select on jusflow.audit_log for select
  using (jusflow.is_org_member(organization_id));
create policy audit_insert on jusflow.audit_log for insert
  with check (jusflow.is_org_member(organization_id));

create policy holidays_read on jusflow.holidays for select using (auth.uid() is not null);
create policy recess_read on jusflow.forensic_recess for select using (auth.uid() is not null);
create policy segments_read on jusflow.cnj_segments for select using (auth.uid() is not null);
create policy lgpd_read on jusflow.lgpd_consents for select using (user_id = auth.uid());
create policy lgpd_insert on jusflow.lgpd_consents for insert with check (user_id = auth.uid());

-- =========================================================
-- VIEW: prazos críticos
-- =========================================================
create or replace view jusflow.v_critical_deadlines
with (security_invoker = true) as
select
  e.*,
  extract(day from (e.starts_at - now()))::int as days_remaining,
  case
    when e.starts_at < now() then 'overdue'
    when e.starts_at < now() + interval '3 days' then 'critical'
    when e.starts_at < now() + interval '7 days' then 'warning'
    else 'ok'
  end as urgency
from jusflow.events e
where e.done = false
  and e.starts_at < now() + interval '30 days';

-- =====================================================================
-- FIM. Lembre-se: expor o schema 'jusflow' em Settings → API → Exposed schemas.
-- =====================================================================
