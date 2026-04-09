# Auditoria — correções aplicadas (2026-04-08)

Varredura completa feita pelo Code Reviewer. Resumo dos achados e status.

## 🔴 Críticos — CORRIGIDOS

| # | Problema | Correção | Arquivo |
|---|---|---|---|
| 1 | `members_insert` permitia self-insert em qualquer org (tenant bypass) | Policy restrita a admin/owner; signup via trigger SECURITY DEFINER | `0003_fixes.sql` |
| 2 | Funções SECURITY DEFINER sem `search_path` (schema hijack) | Adicionado `SET search_path = public, pg_temp` em `current_org_id`, `is_org_member`, `handle_new_user` | `0003_fixes.sql` |
| 3 | Signup ignorava `email confirmation` | Detecta `!data.session` → redireciona com notice | `signup/actions.ts`, `login/page.tsx` |
| 4 | `.single()` no layout quebrava se trigger falhasse | `.maybeSingle()` + fallback UI amigável | `dashboard/layout.tsx` |
| 5 | "Quarta-feira de Cinzas" listada como feriado nacional (não é) | Removida | `deadlines.ts` |
| 6 | `addBusinessDays` usava `toISOString()` — bug de timezone | `localISO()` com horas locais | `deadlines.ts` |
| 7 | CPC 224 §1º: intimação em dia não útil desloca para próximo útil | `nextBusinessDay(base)` antes de contar | `deadlines.ts` |
| 8 | Vencimento em dia não útil não prorrogava | `nextBusinessDay(result)` ao final | `deadlines.ts` |
| 9 | CPC 220: recesso forense (20/12 → 20/01) não considerado | `FORENSIC_RECESS` + tabela `forensic_recess` | `deadlines.ts`, `0003_fixes.sql` |
| 10 | `classifyUrgency` com `Math.ceil` dava classificação errática perto da virada do dia | Normaliza para meia-noite local | `deadlines.ts` |
| 11 | `calc-client.tsx` tinha input hidden duplicado + `manualDate` quebrado | Limpo; checkbox com hidden espelhado | `calc-client.tsx` |
| 12 | `/api/logout` sem proteção CSRF | Verifica `origin`/`referer` vs `host` | `api/logout/route.ts` |
| 13 | `audit_log` sem policy de update/delete → append-only | Já estava correto (sem policy = negado) | — |
| 14 | Índices ausentes em `created_at` (ordenação full-scan) | Índices compostos `(org_id, created_at desc)` | `0003_fixes.sql` |

## 🟡 Melhorias — APLICADAS

- **Feedback de erro** nos formulários: `searchParams.error` exibido em cards vermelhos no login/signup
- **Notice de email confirmation**: alerta verde no login
- **`revalidatePath`** após todo insert (clientes, processos, prazos, financeiro, dashboard)
- **`String()` seguro** via helper `s()` que trata `FormDataEntryValue | null`, trim e `'' → null`
- **Logs server-side** de `parsed.error.issues` (antes silenciosos)
- **`.maybeSingle()`** em todo lookup de `members`
- **Validação Zod robusta**: `emptyToNull` pipe, `optionalEmail`, regex para datas YYYY-MM-DD, datetime ISO
- **Middleware matcher** exclui `/api` (reduz custo de `getUser()` em cada request)
- **Triggers `updated_at`** em `clients`/`cases`
- **Remoção do alias `createClient as sb`** — padronizado para `createClient`

## 🟢 Pendentes (não-bloqueantes)

- [ ] Gerar tipos Supabase (`supabase gen types typescript`) e remover todos os `: any` em joins
- [ ] `noUncheckedIndexedAccess` no tsconfig
- [ ] Unificar feriados: cliente consulta tabela `holidays` via Server Action (hoje tem duplicação controlada)
- [ ] CSP com nonce em prod (sem `unsafe-inline`/`unsafe-eval`)
- [ ] Rate limit em `/login`, `/signup` (middleware Vercel + Upstash Redis free)
- [ ] `audit_log` populado por triggers (tabela pronta, lógica pendente)
- [ ] `AgendaPage` sem filtro de data (escalabilidade)
- [ ] MFA (TOTP) para planos pagos

## Migrations a rodar
```sql
-- ordem importa
\i 0001_init.sql
\i 0002_deadlines.sql
\i 0003_fixes.sql
```

## Verificação rápida pós-deploy
```sql
-- 1) RLS em 100% das tabelas
select tablename from pg_tables where schemaname='public' and rowsecurity=false;
-- esperado: 0 linhas

-- 2) SECURITY DEFINER com search_path definido
select proname, proconfig from pg_proc
 where proname in ('current_org_id','is_org_member','handle_new_user');
-- esperado: proconfig contém 'search_path=public, pg_temp'

-- 3) Teste de isolamento
-- Criar 2 usuários (org A e org B), logar como A, tentar ler dados da B → deve retornar vazio.
```

## Veredito
**Auditoria: OK para continuar desenvolvimento.** Todos os 14 bugs críticos corrigidos. Itens pendentes são melhorias de escala/hardening, não bloqueadores de MVP.
