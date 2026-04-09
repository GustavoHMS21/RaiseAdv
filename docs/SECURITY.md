# Segurança — JusFlow

Dados jurídicos são sigilosos (OAB + LGPD). Segurança é requisito, não feature.

## Princípios
1. **Zero trust por default.** Toda query passa por RLS.
2. **Isolamento multi-tenant** via `organization_id` em todas as tabelas + políticas RLS.
3. **Nenhum segredo no cliente.** Service role key NUNCA no browser.
4. **LGPD-ready:** export de dados, delete em cascata, log de acesso.

## Camadas

### 1. Auth
- Supabase Auth (email+senha + magic link).
- Senha mínima 12 chars, rate-limit nativo.
- MFA opcional (TOTP) para planos pagos.
- Sessões via cookies httpOnly + Secure + SameSite=Lax.

### 2. Autorização
- **RLS habilitado em TODAS as tabelas.** Sem exceção.
- Policy padrão: `organization_id = (select organization_id from members where user_id = auth.uid())`
- Roles por membro: `owner | admin | lawyer | assistant`.

### 3. Dados
- Em trânsito: TLS 1.3 (Supabase + Vercel).
- Em repouso: AES-256 (Supabase Postgres nativo).
- Backups diários automáticos (Supabase).
- Documentos no Storage com buckets privados + signed URLs (expiração 5 min).

### 4. Código
- Next.js Server Actions / Route Handlers para toda mutação (nada de REST aberto).
- Validação de input com **Zod** em toda entrada.
- Sanitização de HTML em campos ricos (DOMPurify).
- CSRF: Next.js Server Actions já trazem proteção.
- Headers: CSP, HSTS, X-Frame-Options=DENY, X-Content-Type-Options=nosniff.

### 5. Auditoria
- Tabela `audit_log` registra: user_id, action, entity, entity_id, ip, user_agent, timestamp.
- Logs imutáveis (append-only, RLS bloqueia UPDATE/DELETE).

### 6. Segredos
- `.env.local` só em dev, nunca commitado.
- Prod: variáveis no Vercel/Supabase dashboard.
- Rotação a cada 90 dias.

## Checklist pré-deploy
- [ ] RLS habilitado em todas as tabelas (`select * from pg_tables where schemaname='public'` + check `rowsecurity`)
- [ ] Nenhum `SUPABASE_SERVICE_ROLE_KEY` referenciado em código client-side
- [ ] Todos os endpoints validam sessão
- [ ] Zod schemas em 100% das mutations
- [ ] CSP configurado em `next.config.js`
- [ ] Rate limit em login (Supabase default + Vercel middleware extra)
- [ ] Backup restore testado
- [ ] Política de privacidade + termos LGPD publicados
