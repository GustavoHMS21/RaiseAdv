# Setup — JusFlow

## 1. Pré-requisitos
- Node 20+
- Conta Supabase (free) — https://supabase.com
- Conta Vercel (free) — opcional, só para deploy

## 2. Supabase
1. Criar projeto em supabase.com
2. Settings → API → copiar `URL` e `anon key`
3. SQL Editor → colar conteúdo de `supabase/migrations/0001_init.sql` → Run
4. Authentication → Providers → Email → ativar, desativar "Confirm email" só em dev
5. Authentication → URL Configuration → Site URL = http://localhost:3000

## 3. Local
```bash
npm install
cp .env.example .env.local
# editar .env.local com URL + anon key
npm run dev
```
Abrir http://localhost:3000

## 4. Deploy Vercel
1. Push do repo no GitHub
2. Vercel → Import → selecionar repo
3. Environment Variables → colar as 3 do `.env.example`
4. Deploy

## 5. Checklist pré-produção
- [ ] Reativar "Confirm email" no Supabase
- [ ] Atualizar Site URL para domínio prod
- [ ] Rodar query de verificação de RLS (ver `AUDIT.md`)
- [ ] Testar signup → criar cliente → criar processo → logout → login
- [ ] Testar isolamento entre 2 contas
- [ ] Publicar Política de Privacidade + Termos (LGPD)
