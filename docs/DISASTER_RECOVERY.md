# Plano de Disaster Recovery — RaiseAdv

## Objetivos

| Métrica | Target |
|---------|--------|
| **RTO** (Recovery Time Objective) | 4 horas |
| **RPO** (Recovery Point Objective) | 24 horas |
| **MTTR** (Mean Time To Repair) | < 2 horas |

---

## Cenários cobertos

### 1. Indisponibilidade do Vercel (frontend offline)

**Detecção:** alerta UptimeRobot + status.vercel-status.com

**Resposta:**
1. Verificar se é incidente Vercel global ou específico do projeto
2. Se global: aguardar update Vercel + comunicar usuários (status page)
3. Se específico: redeploy via `git push` ou rollback no Vercel Dashboard
4. Se persistente: deploy alternativo via Cloudflare Pages ou Netlify (mesmo build)

**Timeline esperado:** 15-60 minutos

### 2. Indisponibilidade do Supabase (backend offline)

**Detecção:** alerta UptimeRobot na API + status.supabase.com

**Resposta:**
1. Verificar status.supabase.com
2. Se incidente Supabase: aguardar resolução + colocar app em modo "read-only" via feature flag
3. Se PITR disponível: restaurar para snapshot mais recente
4. Se Supabase totalmente perdido: ver Cenário 5

**Timeline esperado:** 30 min - 4 horas

### 3. Vazamento de credenciais

**Detecção:** GitHub secret scanning, alerta de uso anômalo no Supabase, monitoramento de IPs

**Resposta IMEDIATA:**
1. **Rotacionar service_role key** no Supabase Dashboard (invalida a antiga)
2. **Rotacionar anon key** se anon foi exposta
3. Atualizar `.env.local` e Vercel env vars
4. Redeploy
5. Auditar `jusflow.access_logs` para tentativas suspeitas
6. Notificar ANPD em até 3 dias úteis (Resolução 15/2024)
7. Notificar usuários afetados

**Timeline:** < 1 hora para rotação, 72h para notificação ANPD

### 4. Ransomware / corrupção maliciosa de dados

**Detecção:** alertas de write-rate anômalo, integrity checks falhando

**Resposta:**
1. **Isolar:** rotacionar todas as keys, suspender acesso de service_role
2. **Preservar evidência:** snapshot imediato do estado atual (mesmo corrompido)
3. **Restaurar:** PITR para snapshot anterior à corrupção
4. **Investigar:** auditar `access_logs`, identificar vetor
5. **Remediar:** patch da vulnerabilidade explorada
6. **Comunicar:** notificação ANPD + usuários

**Timeline:** 4-8 horas

### 5. Catástrofe total (perda de tudo no Supabase)

**Pré-requisito:** ter backups externos (Camada 3 do BACKUP.md)

**Resposta:**
1. Criar novo projeto Supabase em região diferente (ex: us-east-1 se sa-east-1 caiu)
2. Aplicar todas as migrações: `supabase/migrations/*.sql` (em ordem)
3. Importar último backup JSON disponível via `scripts/restore.ts`
4. Atualizar `.env.local` e Vercel env vars com novas credenciais
5. Redeploy aplicação
6. Smoke test: login, listar dados, criar registro
7. Comunicar usuários da janela de perda de dados (até 24h pelo RPO)

**Timeline esperado:** 4 horas

---

## Comunicação durante incidente

### Status page
- **URL pública:** status.raiseadv.com.br (a configurar)
- **Provider sugerido:** statuspage.io (free tier) ou Better Stack

### Templates de email

**Início:**
```
Assunto: [RaiseAdv] Estamos investigando uma instabilidade

Identificamos um problema afetando [funcionalidade]. Nossa equipe está
investigando. Atualizações em status.raiseadv.com.br

Iniciado: [HH:MM BRT]
```

**Resolução:**
```
Assunto: [RaiseAdv] Incidente resolvido

O incidente iniciado às [HH:MM] foi resolvido às [HH:MM]. Causa:
[descrição]. Próximos passos: [post-mortem].

Nenhum dado foi perdido / Houve perda de [...] e estamos restaurando.
```

---

## Equipe de resposta

| Papel | Responsabilidade | Contato |
|-------|------------------|---------|
| **Incident Commander** | Decisões durante incidente | (a definir) |
| **DPO** | Notificação ANPD + usuários | dpo@raiseadv.com.br |
| **CTO/Dev** | Investigação técnica + restore | (a definir) |
| **Comunicação** | Status page + emails | (a definir) |

---

## Pós-incidente (post-mortem)

Em até 5 dias úteis após resolução:

1. Documento `docs/post-mortems/YYYY-MM-DD-titulo.md` com:
   - Timeline (detecção → mitigação → resolução)
   - Causa raiz
   - Impacto (usuários afetados, dados afetados, SLA)
   - O que funcionou
   - O que falhou
   - Action items com owner + deadline
2. Atualização do plano de DR se necessário
3. Compartilhar lições aprendidas com a equipe

**Princípio:** blameless post-mortem — focamos no sistema, não em culpados.

---

## Drills (simulações)

Realizar **trimestralmente**:

- **Q1:** Simular vazamento de credenciais (rotação completa)
- **Q2:** Simular restore de backup
- **Q3:** Simular falha de Supabase (deploy alternativo)
- **Q4:** Simular ransomware (PITR + comunicação)

Documentar cada drill em `docs/dr-drills/`.

---

## Última revisão

11/04/2026 — versão inicial.

Próxima revisão: 11/10/2026.
