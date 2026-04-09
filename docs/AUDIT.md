# Security Audit — MVP inicial

Data: 2026-04-08. Escopo: scaffold inicial (auth, RLS, UI básica).

## ✅ Passou
| Check | Status | Nota |
|---|---|---|
| RLS habilitado em todas as tabelas | ✅ | `enable row level security` em organizations, members, clients, cases, case_movements, events, finance_entries, audit_log |
| Policies default deny | ✅ | Sem policy = negado; todas com `is_org_member(organization_id)` |
| Service role key fora do client | ✅ | `lib/supabase/client.ts` usa só ANON; server.ts idem |
| Cookies httpOnly via @supabase/ssr | ✅ | Middleware renova sessão; não usa localStorage |
| Validação Zod em mutations | ✅ | `validators.ts`; login/signup actions validam antes |
| Headers de segurança | ✅ | CSP, HSTS, X-Frame-Options=DENY, nosniff, Permissions-Policy em `next.config.js` |
| CSRF protection | ✅ | Server Actions do Next 14 trazem proteção nativa |
| Senha mínima forte | ✅ | 12 chars (acima do padrão 8) |
| Auth check em dashboard | ✅ | `dashboard/layout.tsx` faz `getUser()` + redirect; middleware também |
| Isolamento multi-tenant | ✅ | Helper `current_org_id()` + `is_org_member(org)` SECURITY DEFINER, evita recursão |
| Trigger auto-provision org no signup | ✅ | `handle_new_user()` cria org + member owner atomicamente |
| Audit log append-only | ✅ | Sem policy de UPDATE/DELETE → negado |
| SQL injection | ✅ | Supabase client usa query builder (parametrizado) |
| XSS | ✅ | React escapa por padrão; sem `dangerouslySetInnerHTML` |
| Secrets em .gitignore | ✅ | `.env*.local` ignorado; `.env.example` sem valores reais |

## ⚠️ Riscos conhecidos / próximos passos
1. **Rate limit no login** — Supabase tem default, mas adicionar middleware Vercel extra para brute force em prod.
2. **MFA** — planejado para v1.1 (pagos).
3. **CSP inclui `unsafe-inline` / `unsafe-eval`** — necessário para Next dev; endurecer em prod com nonces.
4. **Confirmação de email** — ativar no Supabase dashboard antes de prod (hoje signup loga direto).
5. **Signed URLs para documentos** — implementar quando o módulo Storage for adicionado (não está no MVP ainda).
6. **Audit log trigger** — tabela existe mas triggers de inserção automática ainda não foram adicionadas. Adicionar `before update` em cases/clients/finance.
7. **LGPD — export + delete de dados** — endpoint ainda não implementado.
8. **Testes automatizados** — nenhum. Adicionar Playwright + pgTAP para policies.
9. **Error handling nos Server Actions** — hoje redireciona com `?error=`; melhorar com mensagens amigáveis.
10. **Sanitização em campos `notes` (texto livre)** — React escapa, mas se algum dia renderizar como HTML, usar DOMPurify.

## Verificação manual a rodar após deploy
```sql
-- Confirmar RLS em 100%
select tablename, rowsecurity from pg_tables where schemaname='public' and rowsecurity=false;
-- Deve retornar 0 linhas.

-- Testar isolamento criando 2 usuários em orgs diferentes e tentando cross-read.
```

## Veredito
**Scaffold seguro para prosseguir.** Nenhum bloqueador crítico. Endurecer CSP e ativar confirmação de email antes de colocar em produção.
