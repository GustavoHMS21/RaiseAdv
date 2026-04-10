-- =====================================================================
-- RaiseAdv — Migration de Compliance (LGPD + Marco Civil + CDC)
-- Rodar DEPOIS do ALL_IN_ONE.sql
-- =====================================================================

-- 1. ACCESS LOGS — Marco Civil da Internet art. 15 (retenção 6 meses)
create table if not exists jusflow.access_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  ip_address inet,
  user_agent text,
  action text not null,           -- 'login', 'page_view', 'data_export', 'data_delete', etc.
  resource text,                   -- ex: 'clients', 'cases', 'events'
  resource_id uuid,
  session_id text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- Index para buscas por data (cleanup) e por user
create index if not exists idx_access_logs_created on jusflow.access_logs(created_at);
create index if not exists idx_access_logs_user on jusflow.access_logs(user_id, created_at);

-- RLS: apenas service_role pode inserir/ler (sigilo judicial MCI art. 15)
alter table jusflow.access_logs enable row level security;
drop policy if exists "access_logs_no_user_access" on jusflow.access_logs;
create policy "access_logs_no_user_access" on jusflow.access_logs for all using (false);

-- 2. CONSENT RECORDS — LGPD art. 8 §2 (prova de consentimento)
-- Complementa lgpd_consents existente com versionamento e tipos
create table if not exists jusflow.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_type text not null check (consent_type in ('terms', 'privacy', 'marketing', 'data_processing')),
  version text not null,
  granted_at timestamptz not null default now(),
  ip_address inet,
  user_agent text,
  revoked_at timestamptz,
  unique(user_id, consent_type, version)
);

alter table jusflow.consent_records enable row level security;
drop policy if exists "consent_own_records" on jusflow.consent_records;
create policy "consent_own_records" on jusflow.consent_records
  for select using (auth.uid() = user_id);
drop policy if exists "consent_insert_own" on jusflow.consent_records;
create policy "consent_insert_own" on jusflow.consent_records
  for insert with check (auth.uid() = user_id);

-- 3. DATA SUBJECT REQUESTS — LGPD art. 18 (rastreio de solicitações)
create table if not exists jusflow.data_subject_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_type text not null check (request_type in (
    'access', 'correction', 'deletion', 'anonymization',
    'portability', 'revoke_consent', 'info_sharing'
  )),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'denied')),
  details text,
  response text,
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  responded_by uuid references auth.users(id)
);

alter table jusflow.data_subject_requests enable row level security;
drop policy if exists "dsr_own_requests" on jusflow.data_subject_requests;
create policy "dsr_own_requests" on jusflow.data_subject_requests
  for select using (auth.uid() = user_id);
drop policy if exists "dsr_insert_own" on jusflow.data_subject_requests;
create policy "dsr_insert_own" on jusflow.data_subject_requests
  for insert with check (auth.uid() = user_id);

-- 4. ROPA — Record of Processing Activities (LGPD art. 37)
-- Tabela de referência (seed) — documenta cada atividade de tratamento
create table if not exists jusflow.processing_activities (
  id uuid primary key default gen_random_uuid(),
  activity text not null,
  data_category text not null,
  legal_basis text not null,          -- 'contract', 'legal_obligation', 'legitimate_interest', 'consent'
  legal_reference text not null,      -- ex: 'LGPD art. 7, V'
  purpose text not null,
  retention_period text not null,     -- ex: '5 anos após encerramento do caso'
  shared_with text,                   -- ex: 'Supabase (processador), Vercel (hospedagem)'
  created_at timestamptz not null default now()
);

alter table jusflow.processing_activities enable row level security;
drop policy if exists "ropa_public_read" on jusflow.processing_activities;
create policy "ropa_public_read" on jusflow.processing_activities
  for select using (true);  -- ROPA é informação pública por natureza

-- Seed ROPA
insert into jusflow.processing_activities (activity, data_category, legal_basis, legal_reference, purpose, retention_period, shared_with) values
  ('Autenticação e login', 'Email, senha (hash)', 'contract', 'LGPD art. 7, V', 'Execução do contrato de prestação do serviço SaaS', 'Enquanto a conta existir + 6 meses após exclusão', 'Supabase Auth (processador)'),
  ('Cadastro de clientes do advogado', 'Nome, CPF/CNPJ, email, telefone, endereço', 'contract', 'LGPD art. 7, V + art. 7, VI', 'Gestão de clientes para exercício regular de direitos em processo judicial', '5 anos após encerramento do último caso vinculado (CC art. 206 §5º)', 'Supabase (processador)'),
  ('Gestão de processos judiciais', 'Número CNJ, tribunal, vara, partes, andamentos', 'legal_obligation', 'LGPD art. 7, II + art. 7, VI', 'Exercício regular de direitos em processo judicial e cumprimento de obrigação legal', '5 anos após trânsito em julgado ou arquivamento', 'Supabase (processador), DataJud/CNJ (fonte pública)'),
  ('Cálculo de prazos processuais', 'Datas de intimação, prazos, feriados', 'contract', 'LGPD art. 7, V', 'Cálculo automatizado de prazos em dias úteis conforme CPC', 'Enquanto o processo estiver ativo', 'Nenhum'),
  ('Controle financeiro', 'Valores, honorários, despesas', 'contract', 'LGPD art. 7, V + art. 7, II', 'Gestão financeira do escritório e cumprimento de obrigações fiscais', '5 anos (CTN art. 173-174)', 'Supabase (processador)'),
  ('Logs de acesso', 'IP, user-agent, timestamp, ação', 'legal_obligation', 'Marco Civil art. 15 + LGPD art. 7, II', 'Cumprimento da obrigação legal de retenção de registros de acesso', '6 meses (Marco Civil art. 15)', 'Supabase (processador)'),
  ('Consentimento LGPD', 'Aceite de termos, versão, IP, timestamp', 'legal_obligation', 'LGPD art. 8, §2', 'Prova de consentimento conforme exigido por lei', 'Enquanto o consentimento for válido + 5 anos', 'Nenhum'),
  ('Comunicações de marketing', 'Email', 'consent', 'LGPD art. 7, I', 'Envio de newsletters e comunicações opcionais', 'Até revogação do consentimento', 'Resend (processador)')
on conflict do nothing;

-- 5. Cleanup automático de access_logs (6 meses)
-- Nota: Requer pg_cron habilitado no Supabase (Pro plan) ou cron externo.
-- Se pg_cron disponível, descomentar:
-- select cron.schedule('cleanup-access-logs', '0 3 * * 0', $$
--   delete from jusflow.access_logs where created_at < now() - interval '6 months';
-- $$);
