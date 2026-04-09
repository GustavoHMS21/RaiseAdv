-- JusFlow — schema inicial com RLS (multi-tenant por organization_id)
-- Segurança: TODAS as tabelas com RLS habilitado. Default deny.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =========================================================
-- ORGANIZAÇÕES (tenants)
-- =========================================================
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  plan text not null default 'free' check (plan in ('free','pro','team')),
  created_at timestamptz not null default now()
);

-- =========================================================
-- MEMBERS (user ↔ org + role)
-- =========================================================
create table members (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  role text not null default 'lawyer' check (role in ('owner','admin','lawyer','assistant')),
  created_at timestamptz not null default now(),
  unique(user_id, organization_id)
);
create index idx_members_user on members(user_id);
create index idx_members_org on members(organization_id);

-- Helper: org do usuário atual
create or replace function current_org_id() returns uuid
language sql stable security definer as $$
  select organization_id from members where user_id = auth.uid() limit 1;
$$;

create or replace function is_org_member(org uuid) returns boolean
language sql stable security definer as $$
  select exists(select 1 from members where user_id = auth.uid() and organization_id = org);
$$;

-- =========================================================
-- CLIENTES
-- =========================================================
create table clients (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  type text not null check (type in ('pf','pj')),
  name text not null,
  document text, -- CPF/CNPJ
  email text,
  phone text,
  address text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_clients_org on clients(organization_id);

-- =========================================================
-- PROCESSOS
-- =========================================================
create table cases (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  cnj_number text,             -- número CNJ
  title text not null,
  court text,                  -- vara/tribunal
  area text,                   -- cível, trabalhista, etc
  status text not null default 'active' check (status in ('active','archived','won','lost','settled')),
  opposing_party text,
  value_cents bigint default 0,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_cases_org on cases(organization_id);
create index idx_cases_client on cases(client_id);

-- =========================================================
-- MOVIMENTAÇÕES / timeline
-- =========================================================
create table case_movements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  case_id uuid not null references cases(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  description text not null,
  source text default 'manual',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index idx_mov_case on case_movements(case_id);

-- =========================================================
-- AGENDA / PRAZOS
-- =========================================================
create table events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  case_id uuid references cases(id) on delete cascade,
  title text not null,
  kind text not null default 'deadline' check (kind in ('deadline','hearing','meeting','task')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  done boolean not null default false,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index idx_events_org_start on events(organization_id, starts_at);

-- =========================================================
-- FINANCEIRO
-- =========================================================
create table finance_entries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  case_id uuid references cases(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  kind text not null check (kind in ('income','expense')),
  amount_cents bigint not null,
  description text not null,
  due_date date,
  paid_at date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index idx_fin_org on finance_entries(organization_id);

-- =========================================================
-- AUDIT LOG (append-only)
-- =========================================================
create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid,
  user_id uuid,
  action text not null,
  entity text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_org on audit_log(organization_id, created_at desc);

-- =========================================================
-- RLS — habilitado em TODAS as tabelas
-- =========================================================
alter table organizations    enable row level security;
alter table members          enable row level security;
alter table clients          enable row level security;
alter table cases            enable row level security;
alter table case_movements   enable row level security;
alter table events           enable row level security;
alter table finance_entries  enable row level security;
alter table audit_log        enable row level security;

-- ORGANIZATIONS: membro da org pode ler; só owner pode update
create policy org_select on organizations for select
  using (is_org_member(id));
create policy org_update on organizations for update
  using (exists(select 1 from members where user_id=auth.uid() and organization_id=organizations.id and role in ('owner','admin')));

-- MEMBERS: usuário vê membros das suas orgs
create policy members_select on members for select
  using (is_org_member(organization_id));
create policy members_insert on members for insert
  with check (
    -- self-insert no signup (primeira org) OU admin/owner adicionando
    user_id = auth.uid()
    or exists(select 1 from members m where m.user_id=auth.uid() and m.organization_id=members.organization_id and m.role in ('owner','admin'))
  );
create policy members_delete on members for delete
  using (exists(select 1 from members m where m.user_id=auth.uid() and m.organization_id=members.organization_id and m.role in ('owner','admin')));

-- Política reutilizável: tenant-isolated CRUD
-- CLIENTS
create policy clients_all on clients for all
  using (is_org_member(organization_id))
  with check (is_org_member(organization_id));

-- CASES
create policy cases_all on cases for all
  using (is_org_member(organization_id))
  with check (is_org_member(organization_id));

-- MOVEMENTS
create policy movements_all on case_movements for all
  using (is_org_member(organization_id))
  with check (is_org_member(organization_id));

-- EVENTS
create policy events_all on events for all
  using (is_org_member(organization_id))
  with check (is_org_member(organization_id));

-- FINANCE
create policy finance_all on finance_entries for all
  using (is_org_member(organization_id))
  with check (is_org_member(organization_id));

-- AUDIT LOG: read-only para membros, insert via trigger, sem update/delete
create policy audit_select on audit_log for select
  using (is_org_member(organization_id));
create policy audit_insert on audit_log for insert
  with check (is_org_member(organization_id));
-- (sem policy de update/delete = negado por default)

-- =========================================================
-- Trigger: auto-criar org + member no signup
-- =========================================================
create or replace function handle_new_user() returns trigger
language plpgsql security definer as $$
declare
  new_org_id uuid;
begin
  insert into organizations (name) values (coalesce(new.raw_user_meta_data->>'org_name', 'Meu Escritório'))
    returning id into new_org_id;
  insert into members (user_id, organization_id, role) values (new.id, new_org_id, 'owner');
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();
