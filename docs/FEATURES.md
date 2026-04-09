# Features — o que o advogado precisa

## Dores principais mapeadas
1. **Perder prazo = perda da causa + risco OAB** ← foco #1
2. Controle de processos espalhado em planilhas
3. Cobrança de honorários sem organização
4. Agenda desconectada dos processos
5. Software caro (Astrea R$209+)

## Prioridade 0 — Prazos (✅ implementado)
- [x] Calculadora de prazos em **dias úteis** (CPC art. 219)
- [x] Presets: contestação, apelação, embargos, agravo, RE/REsp, etc.
- [x] Feriados nacionais 2026/2027 considerados
- [x] Status visual: VENCIDO / Crítico (≤3d) / Atenção (≤7d) / No prazo
- [x] Dashboard widget com contadores de urgência
- [x] Página dedicada `/dashboard/prazos` com agrupamento
- [x] Vínculo com processo
- [x] Prioridade (crítica/alta/normal/baixa)
- [x] Data base (intimação) + cálculo server-side confiável
- [ ] Alertas por email (7d, 3d, 1d antes) — v1.1 (Resend/Supabase cron)
- [ ] Push notification PWA — v1.2
- [ ] Importação de feriados estaduais/tribunais específicos — v1.2

## P1 — Essenciais (✅ base)
- [x] Clientes PF/PJ
- [x] Processos com CNJ, vara, área, valor, parte contrária
- [x] Financeiro receita/despesa com vínculo processo+cliente
- [x] Multi-usuário com RLS multi-tenant
- [x] Dashboard com KPIs
- [ ] Timeline de movimentações do processo (tabela pronta, UI pendente)
- [ ] Upload de documentos (Supabase Storage) — v1.1

## P2 — Diferenciais
- [ ] Busca unificada (⌘K)
- [ ] Geração de petições a partir de templates
- [ ] IA: resumo de processo (Claude Haiku)
- [ ] Timesheet (apontamento de horas)
- [ ] Relatórios/exportação PDF
- [ ] Captura automática de publicações (Escavador/Codex API) — v2
- [ ] App mobile PWA

## P3 — Escala
- [ ] Kanban de tarefas
- [ ] Permissões granulares por processo
- [ ] Integração WhatsApp (lembretes)
- [ ] Billing Stripe/Asaas

## Comparação rápida Astrea vs JusFlow MVP
| Feature | Astrea | JusFlow v0.1 |
|---|---|---|
| Cálculo de prazos dias úteis | ✅ | ✅ |
| Feriados automáticos | ✅ | ✅ (nacional) |
| Alertas email | ✅ | 🔜 v1.1 |
| Captura Diários Oficiais | ✅ | 🔜 v2 |
| CRM clientes | ✅ | ✅ |
| Financeiro | ✅ | ✅ básico |
| Multi-usuário | ✅ | ✅ |
| Mobile | App nativo | PWA 🔜 |
| **Preço** | R$ 209+/mês | **R$ 49-89/mês** |
