# RaiseAdv

Software jurídico moderno para advogados autônomos e escritórios pequenos. Alternativa acessível ao Astrea/Aurum (R$ 49–89/mês vs R$ 209/mês).

> **Status:** MVP em desenvolvimento — Sprint Semana 1

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript strict |
| Estilo | Tailwind CSS 3, componentes próprios (`components/ui/`) |
| Backend | Server Components, Server Actions, Route Handlers |
| Banco | Supabase (PostgreSQL) — schema `jusflow`, RLS multi-tenant |
| Auth | Supabase Auth (email + MFA planejado) |
| Validação | Zod |
| Infra | Vercel (deploy) |

## Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, signup (sem sidebar)
│   ├── api/                # Route handlers (logout, LGPD, holidays)
│   ├── dashboard/          # Área logada
│   │   ├── prazos/         # Gestão de prazos (feature principal)
│   │   ├── processos/      # Gestão de processos
│   │   ├── clientes/       # Cadastro de clientes
│   │   ├── agenda/         # Agenda / eventos
│   │   └── financeiro/     # Controle financeiro
│   ├── legal/              # Termos de uso, privacidade (LGPD)
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Componentes base (Button, Input, Card, Badge...)
│   └── dashboard/          # Componentes do dashboard (Sidebar, PageHeader...)
├── lib/
│   ├── supabase/           # Clients: server.ts, client.ts, middleware.ts
│   ├── actions.ts          # getAuthContext(), ActionResult helpers
│   ├── deadlines.ts        # Calculadora CPC (art. 219, 220, 224)
│   ├── cnj.ts              # Validador CNJ (ISO 7064 Mod 97-10)
│   ├── datajud.ts          # API DataJud (tribunais)
│   ├── brasilapi.ts        # Feriados nacionais
│   ├── validators.ts       # Schemas Zod
│   └── utils.ts            # cn(), formatBRL()
├── types/
│   └── database.ts         # Tipos TypeScript do schema jusflow
├── supabase/
│   └── migrations/
│       └── ALL_IN_ONE.sql  # Migration única idempotente
├── docs/                   # Documentação técnica
└── middleware.ts            # Auth guard
```

## Setup Local

### 1. Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com) (free tier)

### 2. Clonar e instalar
```bash
git clone https://github.com/GustavoHMS21/RaiseAdv.git
cd RaiseAdv
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```

Editar `.env.local` com as credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Rodar a migration
1. Abrir **Supabase Dashboard → SQL Editor**
2. Colar o conteúdo de `supabase/migrations/ALL_IN_ONE.sql`
3. Executar
4. Ir em **Project Settings → API → Exposed schemas** → adicionar `jusflow`

### 5. Iniciar dev server
```bash
npm run dev
```

Acessar http://localhost:3000

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server (hot reload) |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Compliance

- **CPC** — Lei 13.105/2015: cálculo de prazos em dias úteis (art. 219), recesso forense (art. 220), regras de prorrogação (art. 224 §1º/§3º)
- **LGPD** — Lei 13.709/2018: consentimento, exportação de dados (art. 18), página de privacidade
- **CNJ** — Resolução 65/2008: validação de numeração unificada (ISO 7064 Mod 97-10)
- **OAB** — Recomendações de segurança: HTTPS, MFA, audit log

## Documentação

- [Mapeamento vs Astrea](docs/MAPEAMENTO_ASTREA.md)
- [Identidade visual](docs/IDENTIDADE.md)
- [Segurança e LGPD](docs/SECURITY.md)
- [Referências legais](docs/LEGAL_REFS.md)
- [Roadmap](ROADMAP.md)

## Licença

Proprietário — © 2026 RaiseAdv. Todos os direitos reservados.
