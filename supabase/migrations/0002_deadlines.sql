-- Sistema de prazos: estende events com campos específicos jurídicos
-- Dor #1 dos advogados: perder prazos = processo disciplinar OAB + perda da causa.

alter table events
  add column if not exists priority text not null default 'normal' check (priority in ('low','normal','high','critical')),
  add column if not exists is_legal_deadline boolean not null default false,
  add column if not exists deadline_type text, -- contestação, recurso, embargos, cumprimento, etc.
  add column if not exists business_days_only boolean not null default true,
  add column if not exists source_date date,   -- data da intimação/publicação
  add column if not exists fulfilled_at timestamptz,
  add column if not exists fulfilled_by uuid references auth.users(id),
  add column if not exists reminder_days int[] default array[7,3,1]; -- alertar X dias antes

create index if not exists idx_events_deadline on events(organization_id, starts_at)
  where done = false;

create index if not exists idx_events_legal on events(organization_id, starts_at)
  where is_legal_deadline = true and done = false;

-- View: prazos críticos (próximos 30 dias, não concluídos)
create or replace view v_critical_deadlines as
select
  e.*,
  extract(day from (e.starts_at - now()))::int as days_remaining,
  case
    when e.starts_at < now() then 'overdue'
    when e.starts_at < now() + interval '3 days' then 'critical'
    when e.starts_at < now() + interval '7 days' then 'warning'
    else 'ok'
  end as urgency
from events e
where e.done = false
  and e.starts_at < now() + interval '30 days';

-- RLS na view herda da tabela events (mesma org)
alter view v_critical_deadlines set (security_invoker = true);

-- Feriados nacionais (base para cálculo de dias úteis)
create table if not exists holidays (
  date date primary key,
  name text not null,
  scope text not null default 'national' -- national | state | municipal
);
alter table holidays enable row level security;
create policy holidays_read on holidays for select using (auth.uid() is not null);

insert into holidays (date, name) values
  ('2026-01-01','Confraternização Universal'),
  ('2026-02-16','Carnaval'),
  ('2026-02-17','Carnaval'),
  ('2026-02-18','Quarta-feira de Cinzas'),
  ('2026-04-03','Sexta-feira Santa'),
  ('2026-04-21','Tiradentes'),
  ('2026-05-01','Dia do Trabalho'),
  ('2026-06-04','Corpus Christi'),
  ('2026-09-07','Independência'),
  ('2026-10-12','Nossa Senhora Aparecida'),
  ('2026-11-02','Finados'),
  ('2026-11-15','Proclamação da República'),
  ('2026-11-20','Consciência Negra'),
  ('2026-12-25','Natal'),
  ('2027-01-01','Confraternização Universal')
on conflict do nothing;
