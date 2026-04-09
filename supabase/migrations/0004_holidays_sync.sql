-- Suporte a sincronização de feriados via BrasilAPI
-- e feriados forenses/recessos específicos por tribunal.

alter table holidays
  add column if not exists tribunal text,          -- null = nacional
  add column if not exists type text default 'national' check (type in ('national','state','municipal','forensic')),
  add column if not exists year int;

create index if not exists idx_holidays_year on holidays(year);

-- Segmentos judiciários (Res. CNJ 65/2008 art. 1º §1º)
create table if not exists cnj_segments (
  code char(1) primary key,
  name text not null
);

insert into cnj_segments values
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

alter table cnj_segments enable row level security;
create policy segments_read on cnj_segments for select using (auth.uid() is not null);

-- Consentimento LGPD (Lei 13.709/2018)
create table if not exists lgpd_consents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete cascade,
  terms_version text not null,
  privacy_version text not null,
  accepted_at timestamptz not null default now(),
  ip inet,
  user_agent text
);
alter table lgpd_consents enable row level security;
create policy lgpd_read on lgpd_consents for select
  using (user_id = auth.uid());
create policy lgpd_insert on lgpd_consents for insert
  with check (user_id = auth.uid());
