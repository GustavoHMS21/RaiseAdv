# JusFlow

Software jurídico moderno para advogados autônomos e escritórios pequenos. Alternativa acessível ao Astrea/Aurum.

> **Status:** MVP em desenvolvimento (scaffolding).

## Por que existe
Advogados pagam R$ 200+/mês em software legado com UX de 2012. JusFlow entrega o essencial com UX moderna por R$ 49-89/mês.

## Stack
- Next.js 14 (App Router) + TypeScript
- Supabase (Auth + Postgres + Storage) com RLS
- Tailwind CSS + shadcn/ui
- Zod (validação) + React Hook Form
- Deploy: Vercel

## Estrutura
```
app/            Next.js App Router
  (auth)/       login, signup
  dashboard/    app autenticado
  api/          route handlers
components/ui/  design system
lib/            supabase clients, utils, validators
supabase/
  migrations/   SQL schema + RLS
docs/           mapeamento, identidade, segurança
```

## Começar
```bash
npm install
cp .env.example .env.local   # preencher com keys Supabase
npm run dev
```

## Documentação
- [Mapeamento vs Astrea](docs/MAPEAMENTO_ASTREA.md)
- [Identidade visual](docs/IDENTIDADE.md)
- [Segurança e LGPD](docs/SECURITY.md)

## Licença
Proprietário. Todos os direitos reservados.
