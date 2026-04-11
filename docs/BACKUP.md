# Estratégia de Backup — RaiseAdv

## Visão geral

O RaiseAdv adota uma estratégia de **backup em camadas** para garantir
disponibilidade contínua dos dados dos usuários, com objetivos:

- **RPO (Recovery Point Objective):** 24 horas — perda máxima aceitável de dados
- **RTO (Recovery Time Objective):** 4 horas — tempo máximo de restauração

---

## Camada 1 — Backups automáticos do Supabase (Point-in-Time Recovery)

### Plano Free
- Backups diários automáticos
- Retenção: 7 dias
- Restauração: via dashboard Supabase

### Plano Pro / Team
- Backups diários automáticos
- **PITR (Point-in-Time Recovery)** — restauração para qualquer segundo dos últimos 7 dias
- Retenção: 30 dias
- WAL (Write-Ahead Log) backup contínuo

**Documentação oficial:**
https://supabase.com/docs/guides/platform/backups

---

## Camada 2 — Snapshots manuais antes de migrações

Antes de aplicar qualquer migração SQL em produção:

1. Acessar o Supabase Dashboard
2. Settings → Database → Backups → "Create manual backup"
3. Aguardar conclusão (~2-5 min)
4. Aplicar a migração
5. Validar integridade
6. Manter snapshot por pelo menos 14 dias

---

## Camada 3 — Export externo periódico (defesa em profundidade)

O Supabase é um SaaS — caso o provedor sofra incidente catastrófico, queremos
ter cópias dos dados fora da infraestrutura dele.

### Script automatizado

Use [`scripts/backup.ts`](../scripts/backup.ts):

```bash
node --loader ts-node/esm scripts/backup.ts
# ou
npx tsx scripts/backup.ts
```

O script:
1. Conecta no Supabase com `SUPABASE_SERVICE_ROLE_KEY`
2. Exporta todas as tabelas do schema `jusflow` para JSON
3. Salva em `backups/YYYY-MM-DD/`
4. Gera um manifest com hash SHA-256 de cada arquivo
5. Pode ser agendado via cron / GitHub Actions / Vercel Cron

### Frequência recomendada
- **Diário** para `clients`, `cases`, `events`, `finance_entries`
- **Semanal** para `processing_activities`, `consent_records`
- **Manual** após mudanças sensíveis

### Storage de backups
- Recomendação: armazenar em **3 locais distintos** (3-2-1 rule):
  1. Workstation local (criptografado com VeraCrypt)
  2. Cloud secundária (Backblaze B2 ou AWS S3 Glacier)
  3. Storage frio offline (HD externo desconectado)

---

## Camada 4 — Backup do código-fonte

- **Git remoto:** GitHub (`GustavoHMS21/RaiseAdv`) — replicação automática
- **Local:** workstation do desenvolvedor
- **Backup adicional:** clone semanal em storage frio

---

## Procedimento de restore

### Cenário 1: corrupção de dados detectada hoje
1. Identificar timestamp do incidente
2. Supabase Dashboard → Database → Backups
3. Selecionar snapshot anterior ao incidente
4. Click "Restore" — confirmar em texto livre
5. **Atenção:** restore PITR sobrescreve o banco inteiro
6. Comunicar usuários via email + status page

### Cenário 2: tabela específica corrompida
1. Não restaurar o banco inteiro
2. Usar o backup JSON do `scripts/backup.ts`
3. Truncar a tabela afetada
4. Re-importar o JSON via script `scripts/restore.ts` (a criar)
5. Validar foreign keys

### Cenário 3: catástrofe Supabase (provedor offline)
1. Provisionar novo projeto Supabase em outra região
2. Aplicar todas as migrações SQL: `supabase/migrations/*.sql`
3. Importar último backup JSON disponível
4. Atualizar `.env.local` com novas credenciais
5. Redeploy do Vercel
6. Comunicar usuários

---

## Validação de backups

Backup que não foi testado **não é backup**.

### Teste mensal de restore
1. Criar projeto Supabase de teste (`raiseadv-test`)
2. Aplicar migrações
3. Importar backup mais recente
4. Rodar suíte de smoke tests:
   - Login funciona
   - Dashboard carrega
   - Lista de processos exibe corretamente
5. Documentar resultado em `docs/BACKUP_TESTS.md`

---

## Conformidade

- **LGPD art. 46** — segurança "técnica e administrativa apta a proteger os dados pessoais"
- **LGPD art. 49** — sistemas com "padrões mínimos definidos pela autoridade nacional"
- **ISO 27001 A.12.3** — backups regulares, testados e documentados

---

## Contatos de emergência

- **Supabase support:** support@supabase.com / status.supabase.com
- **Vercel support:** vercel.com/help / vercel-status.com
- **DPO RaiseAdv:** dpo@raiseadv.com.br

---

## Roadmap de melhorias

- [ ] Cron job automatizado no Vercel para rodar `scripts/backup.ts` diariamente
- [ ] Upload automático para Backblaze B2 / S3 Glacier
- [ ] Alerta em caso de falha de backup
- [ ] Dashboard de status de backups
- [ ] Restore script `scripts/restore.ts`
- [ ] Disaster recovery drill trimestral (game day)
