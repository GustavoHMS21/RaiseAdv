# RaiseAdv — Roadmap & Kanban

> SaaS jurídico para advogados e pequenas bancas. Foco #1: **prazos processuais**.
> Stack: Next.js 14 + Supabase (schema `jusflow`) + Tailwind. Target: **R$ 49–89/mês**.
> Entrega MVP comercial: **4 semanas** a partir de 2026-04-09.

---

## Legenda

- **Prioridade:** P0 (bloqueante) · P1 (crítico) · P2 (importante) · P3 (nice-to-have)
- **Estimativa:** XS (<2h) · S (meio-dia) · M (1 dia) · L (2-3 dias) · XL (semana)
- **Labels:** `infra` `backend` `frontend` `security` `legal` `ux` `billing` `ai` `docs`

---

## 🗂️ BACKLOG

### Semana 2 — Integração CNJ + Documentos
- [ ] **#10** Integração DataJud CNJ — busca automática de andamentos por número CNJ · P1 · L · `backend`
- [ ] **#11** Cache de consultas DataJud (tabela `jusflow.datajud_cache`, TTL 6h) · P2 · S · `backend`
- [ ] **#12** Sync diário de andamentos via cron (Supabase Scheduled Function) · P1 · M · `backend`
- [ ] **#13** Upload de documentos (Supabase Storage bucket privado + RLS) · P1 · L · `backend`
- [ ] **#14** Visualizador PDF inline + download assinado (signed URL 5min) · P1 · M · `frontend` `security`
- [ ] **#15** Vincular documento a processo/cliente · P1 · S · `frontend`

### Semana 3 — Alertas, Edição, IA
- [ ] **#20** Edição inline de clientes / processos / prazos (modo form) · P1 · L · `frontend`
- [ ] **#21** Soft delete (arquivar) + restaurar — `deleted_at` coluna · P1 · M · `backend`
- [ ] **#22** Email de lembrete de prazo (Resend API + cron 7h BRT) · P0 · L · `backend` `legal`
- [ ] **#23** Template de email responsivo (MJML) com CTA para o prazo · P2 · S · `frontend`
- [ ] **#24** Resumo IA de processos (Claude Haiku 4.5, <R$0,01/resumo) · P2 · L · `ai`
- [ ] **#25** Chat contextual com IA sobre um processo (RAG de andamentos) · P3 · XL · `ai`

### Semana 4 — Billing, MFA, Go-live
- [ ] **#30** Stripe billing — planos Free (1 user / 20 proc), Pro R$49, Team R$89 · P0 · L · `billing`
- [ ] **#31** Webhook Stripe → atualiza `organizations.plan` · P0 · M · `backend` `billing`
- [ ] **#32** Paywall por plano (guard nas queries + UI) · P0 · M · `backend`
- [ ] **#33** MFA TOTP (Supabase Auth MFA) obrigatório p/ owner/admin · P0 · M · `security`
- [ ] **#34** PWA (manifest + service worker offline read-only) · P2 · M · `frontend`
- [ ] **#35** E2E tests críticos (Playwright): signup → criar prazo → alerta · P1 · L · `backend`
- [ ] **#36** Deploy produção Vercel + domínio raiseadv.com.br · P0 · S · `infra`
- [ ] **#37** Monitoramento Sentry + uptime (BetterStack free) · P1 · S · `infra`

### Futuro (pós-MVP)
- [ ] **#40** Petição inicial com template + merge fields · P2 · XL · `legal` `frontend`
- [ ] **#41** Controle de honorários contratuais + geração PDF · P2 · L · `legal`
- [ ] **#42** Integração OAB (consulta inscrição + validade) · P3 · M · `legal`
- [ ] **#43** App mobile (React Native / Expo) · P3 · XL · `frontend`
- [ ] **#44** Multi-idioma (pt-BR, es-LATAM) · P3 · L · `frontend`
- [ ] **#45** White-label para escritórios grandes · P3 · XL · `infra`

---

## 🚧 TO DO (Sprint atual — Semana 1, 2026-04-09 → 2026-04-16)

- [ ] **#1** Rodar `ALL_IN_ONE.sql` no Supabase e expor schema `jusflow` · P0 · XS · `infra` _(bloqueia tudo)_
- [ ] **#2** Primeiro signup real + smoke test dashboard · P0 · XS · `backend`
- [ ] **#3** CI: GitHub Actions — lint + typecheck + build em cada push · P1 · S · `infra`
- [ ] **#4** `README.md` — setup, stack, variáveis de ambiente, deploy · P1 · S · `docs`
- [ ] **#5** Revisão de segurança: headers CSP, HSTS, rate-limit login · P0 · M · `security`
- [ ] **#6** LGPD: página de consentimento no primeiro login · P0 · S · `legal`
- [ ] **#7** Seed de feriados 2026 via BrasilAPI (endpoint `/api/holidays/sync` com cron) · P1 · S · `backend`

---

## 🔄 IN PROGRESS

_(vazio — mover item de TO DO quando começar)_

---

## 👀 REVIEW

_(PRs aguardando review)_

---

## ✅ DONE

- [x] **#0.1** Scaffolding Next.js 14 + Tailwind + Supabase SSR · `infra`
- [x] **#0.2** Schema `jusflow` completo — 12 tabelas + RLS + seeds · `backend` `security`
- [x] **#0.3** Calculadora de prazos CPC (art. 219, 220, 224 §1º/§3º) · `legal`
- [x] **#0.4** Validador CNJ (ISO 7064 Mod 97-10 chunked) · `backend`
- [x] **#0.5** CRUD clientes / processos / prazos / agenda / financeiro · `frontend`
- [x] **#0.6** Auth Supabase (login/signup/logout) com CSRF · `security`
- [x] **#0.7** Middleware + redirects dashboard/auth · `backend`
- [x] **#0.8** Páginas legais (Termos + Privacidade LGPD) · `legal`
- [x] **#0.9** Export LGPD art. 18 (JSON dump) · `legal`
- [x] **#0.10** Code review — 14 bugs críticos corrigidos · `security`
- [x] **#0.11** Upgrade Next 14.2.15 → 14.2.33 (CVE patch) · `security`
- [x] **#0.12** Migration consolidada `ALL_IN_ONE.sql` idempotente · `infra`
- [x] **#0.13** Supabase clients apontando p/ schema `jusflow` · `backend`

---

## 📊 Cronograma (Gantt textual)

```
Semana 1  [2026-04-09 → 04-16]  ████░░░░  Infra, CI, segurança, LGPD
Semana 2  [2026-04-16 → 04-23]  ░░░░████  DataJud + documentos
Semana 3  [2026-04-23 → 04-30]  ░░░░░░██  Alertas email + edição + IA
Semana 4  [2026-04-30 → 05-07]  ░░░░░░░█  Billing + MFA + deploy
GO-LIVE   2026-05-07  🚀
```

## 🎯 Métricas de sucesso (primeiros 30 dias pós-lançamento)

| Métrica | Meta |
|---|---|
| Signups | 100 |
| Ativação (criou 1 prazo) | 40% |
| Conversão Free → Pro | 8% |
| NPS | ≥ 50 |
| Zero incidentes LGPD | ✅ |
| Uptime | ≥ 99.5% |

## 🚨 Riscos

| # | Risco | Mitigação |
|---|---|---|
| R1 | DataJud API instável | Cache agressivo + fallback manual |
| R2 | Vazamento de dados (LGPD) | RLS + audit_log + MFA + pentest pré-launch |
| R3 | Cálculo de prazo errado → perda processual | Testes unitários exaustivos + disclaimer legal |
| R4 | Concorrência Astrea / Projuris | Preço 4x menor + UX superior + nicho solo/small |
| R5 | Burnout solo-dev | Escopo MVP rígido, não aceitar feature creep |
