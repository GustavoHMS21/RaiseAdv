# Roadmap de entrega — 30 dias até produção

Meta: **JusFlow v1.0 pronto para primeiros clientes pagantes em 08/05/2026.**

## Semana 1 (08–14/04) — Consolidação técnica ✅ em andamento
- [x] Scaffold Next.js + Supabase + Tailwind
- [x] Schema com RLS multi-tenant (migrations 0001-0004)
- [x] Auth SSR + login/signup + logout CSRF
- [x] Módulos: clientes, processos, prazos, financeiro, agenda
- [x] Calculadora de prazos CPC-compliant (art. 219, 220, 224)
- [x] Validador CNJ Módulo 97 (Res. CNJ 65/2008)
- [x] Integração BrasilAPI feriados (sync route)
- [x] Cliente DataJud API Pública (consulta por CNJ)
- [x] Páginas Termos + Privacidade (LGPD-ready)
- [x] Export LGPD (`/api/lgpd/export`)
- [x] Audit de segurança — 14 bugs críticos corrigidos
- [ ] Gerar tipos Supabase (`supabase gen types`) e remover `: any`

## Semana 2 (15–21/04) — UX e produção
- [ ] Tela de busca de processo por CNJ → consulta DataJud → preenche formulário
- [ ] Timeline de movimentações do processo (UI) — tabela já existe
- [ ] Upload de documentos (Supabase Storage com signed URLs, buckets privados)
- [ ] Busca global ⌘K
- [ ] Edição/exclusão de registros (hoje só CRUD parcial)
- [ ] Página de configurações da organização (nome, plano, membros)
- [ ] Página de perfil do usuário + trocar senha
- [ ] Consentimento LGPD no signup (checkbox obrigatório + registro em `lgpd_consents`)

## Semana 3 (22–28/04) — Diferenciais competitivos
- [ ] **Alertas de prazo por email** (Resend + Supabase cron daily 7h)
  - D-7, D-3, D-1, dia do vencimento
  - Digest diário com todos os prazos da semana
- [ ] **IA**: resumo de processo (Claude Haiku) — botão "Resumir movimentações"
- [ ] **Sincronização automática DataJud** — job noturno por processo cadastrado
- [ ] Relatórios básicos (honorários no período, processos por status, produtividade)
- [ ] Exportação PDF de relatórios (via react-pdf)
- [ ] PWA: manifest.json + service worker + ícones

## Semana 4 (29/04–05/05) — Go-to-market
- [ ] **Billing** Stripe/Asaas (3 planos: Free, Pro R$49, Team R$89)
- [ ] Limites por plano (10 processos no Free, ilimitado no Pro)
- [ ] Onboarding: wizard de 3 passos no primeiro login
- [ ] Landing page aprimorada com demo vídeo
- [ ] Blog SEO (3 posts iniciais: cálculo de prazos, alternativas ao Astrea, LGPD escritório)
- [ ] Email transacional (boas-vindas, confirmação, recuperação de senha)
- [ ] Analytics (Plausible / PostHog self-hosted)
- [ ] Rate limit em /login e /signup (middleware + Upstash)
- [ ] MFA TOTP para planos pagos
- [ ] Testes E2E críticos (Playwright): signup → processo → prazo → logout

## Semana 5 (06–08/05) — Launch
- [ ] Deploy produção Vercel + Supabase (SA East)
- [ ] Domínio `jusflow.app` apontado
- [ ] Confirmação de email ativada no Supabase
- [ ] Política de Privacidade + Termos v1.0 publicados
- [ ] Primeiro beta: 10 advogados convidados (R$ 0 por 30 dias)
- [ ] Monitoramento: Sentry + uptime (Better Stack free)
- [ ] Checklist pré-produção do [`SECURITY.md`](SECURITY.md) concluído

## Fora do escopo do MVP (pós-launch)
- Captura automática de Diários Oficiais (v1.1 — Escavador API, custo ~R$ 200/mês)
- App mobile nativo (v2 — PWA atende por ora)
- Templates de petições com variáveis (v1.2)
- Timesheet avançado (v1.2)
- Kanban de tarefas (v1.3)
- Integração WhatsApp (v2)
- Feriados estaduais/municipais por tribunal (v1.1)

## Métricas de sucesso (30 dias pós-launch)
- 50 signups free
- 10 conversões em Pro/Team
- NPS > 40
- Zero incidentes de segurança
- SLA 99% uptime

## Riscos
| Risco | Mitigação |
|---|---|
| DataJud rate limit / indisponível | Cache 1h + fallback manual |
| Supabase free tier limite (500MB) | Monitor + plano Pro $25 se necessário |
| Feriado forense estadual não coberto | v1.1 com feriados por tribunal |
| Cliente perder prazo por bug | Disclaimer nos Termos + testes exaustivos + log de cálculo |
