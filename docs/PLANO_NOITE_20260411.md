# Plano da Noite — 11/04/2026

## Objetivo
Resolver, sem depender de tarefas manuais do usuário, todas as pendências de:
1. **Erros / bugs** — auditoria + correção
2. **Cybersegurança** — hardening adicional
3. **Compliance** — features LGPD restantes
4. **Backup de dados** — documentação + scripts

---

## 1. Auditoria de erros e bugs

- Rodar `tsc --noEmit` (deve passar limpo)
- Rodar `npm audit` e listar vulnerabilidades
- Verificar duplicação: `app/api/lgpd/route.ts` vs `app/api/lgpd/export/route.ts` (consolidar)
- Procurar TODOs e console.log não tratados
- Verificar imports não usados
- Validar todos os Server Actions têm tratamento de erro

## 2. Cybersegurança — hardening adicional

### 2.1 Headers HTTP
- Adicionar `Cross-Origin-Opener-Policy: same-origin`
- Adicionar `Cross-Origin-Resource-Policy: same-origin`
- Adicionar `Cross-Origin-Embedder-Policy: require-corp` (se compatível)
- Refinar `Permissions-Policy` (mais granular)

### 2.2 RFC 9116 — security.txt
- Criar `public/.well-known/security.txt` com canal de divulgação responsável

### 2.3 Validação de senha
- Adicionar validação de força (zxcvbn-ts ou regra custom: maiúscula + minúscula + número + símbolo)
- Bloquear senhas em listas de vazamento (HIBP API com k-anonymity)

### 2.4 Proteção contra enumeration
- Login: respostas idênticas para "email não existe" e "senha errada" (já está OK)
- Signup: rate-limit por email + IP
- Forgot password: confirmar request mesmo se email não existe

### 2.5 Auditoria de dependências
- `npm audit fix --force` se houver vulnerabilidades
- Adicionar `.npmrc` com `audit-level=moderate`

### 2.6 Log de eventos suspeitos
- Adicionar tipo `suspicious_activity` no logAccess
- Logar tentativas falhas de login, rate-limit hit, CSRF fail

### 2.7 Sessão
- Documentar TTL de session token Supabase
- Adicionar logout automático após inatividade (client-side)

## 3. Compliance — features LGPD restantes

### 3.1 Página de configurações LGPD do usuário
`/dashboard/configuracoes` com seções:
- **Meus dados** — exportar (já tem API), botão de download
- **Direitos LGPD** — formulário de solicitação (correção, exclusão, anonymization)
- **Consentimentos** — toggles para marketing (granular)
- **Excluir conta** — botão + confirmação dupla

### 3.2 Página pública ROPA
`/legal/ropa` — Registro de Operações de Tratamento (art. 37 LGPD)
Lê de `jusflow.processing_activities` (RLS permite read público)

### 3.3 Footer global
Componente `<Footer>` com:
- Link Política de Privacidade
- Link Termos
- Link ROPA
- DPO email
- Versão do app

### 3.4 Cookie banner para visitantes
Banner discreto explicando que apenas cookies essenciais são usados (não bloqueante, informativo).

### 3.5 Página de status de solicitação
`/dashboard/configuracoes/solicitacoes` — lista todas as DSRs do usuário com status

## 4. Backup de dados

### 4.1 Documentação
`docs/BACKUP.md` — estratégia completa:
- O que o Supabase já faz (backups diários, 7 dias retenção no plan Free, 30 dias Pro)
- O que o cliente deve fazer adicionalmente
- Procedimento de export manual
- Procedimento de restore

### 4.2 Script de backup
`scripts/backup.ts` — script Node que:
- Conecta no Supabase com service_role
- Exporta todas as tabelas para JSON
- Salva em `backups/YYYY-MM-DD/`
- Pode ser agendado via cron

### 4.3 Disaster Recovery plan
`docs/DISASTER_RECOVERY.md` — plano de recuperação:
- RTO: 4h (target)
- RPO: 24h (último backup diário)
- Procedimento step-by-step para restaurar
- Contatos de emergência (Supabase support, Vercel support)

---

## 5. Integração de access logs

Adicionar `logAccess()` em todos os Server Actions:
- `app/dashboard/clientes/novo/page.tsx` actions (data_create)
- `app/dashboard/processos/novo/page.tsx` actions (data_create)
- `app/dashboard/prazos/novo/page.tsx` actions (data_create)
- `app/dashboard/financeiro/novo/page.tsx` actions (data_create)
- Logout (action: 'logout')

---

## 6. Validação final

- `npx tsc --noEmit`
- `npm run build`
- Commit dividido em 4 commits semânticos:
  1. `chore: audit fixes and dependency updates`
  2. `feat(security): additional hardening — security.txt, COOP/CORP, password strength`
  3. `feat(lgpd): self-service settings page, public ROPA, global footer`
  4. `docs(backup): backup strategy, scripts, and disaster recovery plan`
- Push final

---

## Pendências MANUAIS do usuário (não dá para fazer agora)

- [ ] Rodar SQL `0005_compliance.sql` no Supabase
- [ ] Expor schema `jusflow` no Supabase Dashboard
- [ ] Configurar `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`
- [ ] Criar token GitHub com scope `workflow` para push do CI
- [ ] Criar GitHub Project Board manualmente

Tempo estimado da execução: ~4-5h ininterruptos.
