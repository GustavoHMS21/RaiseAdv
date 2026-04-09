-- Correções de segurança e robustez (audit 2026-04-08)

-- 1) SECURITY DEFINER sem search_path = vetor de schema hijack
create or replace function current_org_id() returns uuid
language sql stable security definer
set search_path = public, pg_temp
as $$
  select organization_id from members where user_id = auth.uid() limit 1;
$$;

create or replace function is_org_member(org uuid) returns boolean
language sql stable security definer
set search_path = public, pg_temp
as $$
  select exists(select 1 from members where user_id = auth.uid() and organization_id = org);
$$;

create or replace function handle_new_user() returns trigger
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare new_org_id uuid;
begin
  insert into organizations (name)
    values (coalesce(nullif(new.raw_user_meta_data->>'org_name',''), 'Meu Escritório'))
    returning id into new_org_id;
  insert into members (user_id, organization_id, role)
    values (new.id, new_org_id, 'owner');
  return new;
end; $$;

-- 2) CRÍTICO: members_insert permitia auto-inserção em qualquer org.
--    Restringir: só owner/admin da org podem adicionar; self-insert apenas se não houver membership ainda (primeiro membro = novo tenant).
drop policy if exists members_insert on members;
create policy members_insert on members for insert
  with check (
    exists (
      select 1 from members m
      where m.user_id = auth.uid()
        and m.organization_id = members.organization_id
        and m.role in ('owner','admin')
    )
  );
-- (Self-insert do signup roda via trigger SECURITY DEFINER → bypassa RLS. Correto.)

-- 3) Índices para ordenação por created_at
create index if not exists idx_cases_created on cases(organization_id, created_at desc);
create index if not exists idx_clients_created on clients(organization_id, created_at desc);
create index if not exists idx_finance_created on finance_entries(organization_id, created_at desc);

-- 4) updated_at triggers
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_clients_updated on clients;
create trigger trg_clients_updated before update on clients
  for each row execute function touch_updated_at();

drop trigger if exists trg_cases_updated on cases;
create trigger trg_cases_updated before update on cases
  for each row execute function touch_updated_at();

-- 5) Recesso forense (20/dez → 20/jan) — CPC art. 220, prazos processuais suspensos
create table if not exists forensic_recess (
  start_date date not null,
  end_date date not null,
  primary key (start_date, end_date)
);
alter table forensic_recess enable row level security;
create policy recess_read on forensic_recess for select using (auth.uid() is not null);

insert into forensic_recess values
  ('2025-12-20','2026-01-20'),
  ('2026-12-20','2027-01-20')
on conflict do nothing;
