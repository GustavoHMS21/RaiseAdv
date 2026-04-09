# Mapeamento Astrea → Nosso Sistema

## Astrea (referência - Aurum)
- 110k+ advogados. Planos: Light/Up/Smart/Company/VIP.
- Preço inicial ~R$ 209/mês, chega a R$ 246,50+ com extras.

### Funcionalidades Astrea
1. **Gestão de processos** — cadastro automático por número CNJ, timeline de movimentações, documentos anexos.
2. **Publicações / Intimações** — captura automática de Diários Oficiais, classificação por prazo/audiência.
3. **Agenda & Prazos** — cálculo automático de prazos processuais, alertas, compromissos.
4. **CRM de Clientes** — cadastro PF/PJ, histórico, documentos, contatos.
5. **Financeiro** — honorários, contas a pagar/receber, relatórios, boletos.
6. **Timesheet** — apontamento de horas por processo/cliente.
7. **Tarefas / Kanban** — distribuição de atividades entre equipe.
8. **Documentos** — templates de petições, geração automática.
9. **App Mobile** — notificações, agenda, timesheet.
10. **IA** — resumo de processos, sugestões.
11. **Relatórios & BI**
12. **Multi-usuário / Permissões**

## Nosso MVP — "JusFlow" (identidade nova)
Foco: advogado autônomo + escritório pequeno (1-5 adv). Preço alvo: **R$ 49-89/mês** (vs R$ 209 Astrea).

### Escopo MVP (v1 — zero custo)
- ✅ Auth (Supabase Auth - grátis)
- ✅ Multi-tenant com RLS (organizações)
- ✅ CRUD Processos (cadastro manual + número CNJ)
- ✅ CRUD Clientes (PF/PJ)
- ✅ Agenda de prazos e compromissos
- ✅ Movimentações do processo (timeline manual)
- ✅ Documentos (Supabase Storage 1GB free)
- ✅ Financeiro básico (honorários + contas)
- ✅ Dashboard com KPIs
- ⏳ v2: captura Diários Oficiais (Codex/Escavador API)
- ⏳ v2: IA resumo (Claude Haiku API)

### Stack (custo zero até ~100 usuários)
| Camada | Tech | Custo |
|---|---|---|
| Frontend | Next.js 14 + TS + Tailwind + shadcn/ui | 0 |
| Hosting | Vercel Hobby | 0 |
| Auth + DB + Storage | Supabase Free (500MB DB, 1GB storage) | 0 |
| Email transacional | Resend Free (3k/mês) | 0 |
| Domínio | ~R$ 40/ano | ~R$ 3/mês |
| **Total fixo** | | **~R$ 3/mês** |

### Monetização
- Free: 1 usuário, 10 processos
- Pro R$ 49/mês: 1 usuário, ilimitado
- Team R$ 89/mês: até 5 usuários
- Pagamentos: Stripe / Asaas

## Diferencial vs Astrea
1. **Preço 60-75% menor**
2. **UX moderna** (Astrea tem interface datada)
3. **Setup em 2 min** (sem onboarding complicado)
4. **Mobile-first PWA** (sem app nativo necessário)
5. **IA nativa** (resumo de processos com Claude)
