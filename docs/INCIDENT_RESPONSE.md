# Plano de Resposta a Incidentes de Segurança — RaiseAdv

**Versão:** 1.0  
**Data:** 2026-04-10  
**Próxima revisão:** 2026-10-10  
**Classificação:** Interno — Confidencial

---

## 1. Objetivo

Estabelecer procedimentos claros e acionáveis para detectar, conter, notificar e remediar incidentes de segurança que envolvam dados pessoais e informações protegidas por sigilo profissional advocatício no sistema RaiseAdv.

Este plano atende aos seguintes requisitos legais:

- **LGPD art. 48** — Comunicação à ANPD e aos titulares em caso de incidente com risco ou dano relevante.
- **Resolução CD/ANPD nº 15/2024** — Prazo de 3 dias úteis para notificação à ANPD.
- **Marco Civil da Internet art. 15** — Preservação de registros de acesso por no mínimo 6 meses.
- **Estatuto da OAB art. 7º, II** — Inviolabilidade do sigilo profissional do advogado.

---

## 2. Equipe de Resposta a Incidentes

| Papel | Responsável | Contato | Responsabilidades |
|-------|-------------|---------|-------------------|
| **DPO (Encarregado)** | A definir | dpo@raiseadv.com.br | Coordena notificações à ANPD e titulares; ponto focal regulatório |
| **CTO** | A definir | cto@raiseadv.com.br | Contenção técnica, análise forense, remediação |
| **Jurídico** | A definir | juridico@raiseadv.com.br | Avaliação de impacto legal, sigilo advocatício, comunicação a escritórios afetados |

**Regra de acionamento:** Qualquer membro da equipe que identificar ou receber relato de incidente deve acionar os demais em até **1 hora**.

---

## 3. Classificação de Incidentes

### Crítico (Severidade 1)

Risco grave e imediato a direitos dos titulares; envolve dados protegidos por sigilo profissional.

- Exposição de dados de processos judiciais de clientes (violação do sigilo advocatício — OAB art. 7º, II)
- Vazamento em massa de dados pessoais sensíveis (CPF, dados de saúde em processos trabalhistas/previdenciários)
- Acesso não autorizado ao banco de dados de produção
- Ransomware com criptografia de dados de clientes

**Ação:** Contenção imediata. Notificação à ANPD em até 3 dias úteis. Notificação aos titulares.

### Alto (Severidade 2)

Comprometimento confirmado com potencial de dano a titulares.

- Acesso indevido a conta de advogado com visualização de dados de clientes
- Exploração de vulnerabilidade com exfiltração parcial de dados
- Comprometimento de credenciais de serviço com acesso a dados pessoais

**Ação:** Contenção em até 4 horas. Avaliar necessidade de notificação à ANPD.

### Médio (Severidade 3)

Incidente contido, sem confirmação de acesso a dados pessoais.

- Tentativa de acesso não autorizado bloqueada pelo sistema
- Vulnerabilidade identificada sem exploração confirmada
- Perda de logs de auditoria (violação do Marco Civil art. 15)

**Ação:** Investigação em até 24 horas. Documentação interna.

### Baixo (Severidade 4)

Evento de segurança sem impacto a dados pessoais ou operações.

- Scan de portas ou tentativas automatizadas de brute force bloqueadas
- Phishing recebido mas não executado
- Falha em componente não crítico sem exposição de dados

**Ação:** Registro. Revisão na próxima reunião de segurança.

---

## 4. Fluxo de Resposta

### 4.1 Detecção e Contenção (Hora 0 a Hora 4)

1. **Identificar** o vetor de ataque e os sistemas afetados.
2. **Isolar** os sistemas comprometidos — desconectar da rede, revogar credenciais, desabilitar contas.
3. **Preservar evidências:**
   - NÃO reiniciar servidores antes de coletar logs.
   - Fazer snapshot dos discos e da memória dos sistemas afetados.
   - Preservar logs de acesso à aplicação (Marco Civil art. 15 — mínimo 6 meses).
   - Preservar logs de banco de dados, WAF e infraestrutura.
4. **Ativar a equipe de resposta** (DPO + CTO + Jurídico).

**Atenção especial (sigilo advocatício):** Se o incidente envolver dados de processos ou comunicações advogado-cliente, o DPO e o Jurídico devem avaliar imediatamente o impacto sobre o sigilo profissional e determinar se escritórios de advocacia clientes precisam ser notificados em caráter prioritário.

### 4.2 Avaliação (Hora 4 a Hora 24)

1. **Escopo:** Quais dados foram afetados? Quantos titulares?
2. **Natureza dos dados:** Dados pessoais? Dados sensíveis (art. 5º, II LGPD)? Dados sob sigilo advocatício?
3. **Risco aos titulares:** Pode causar dano relevante? (discriminação, fraude, violação de sigilo profissional)
4. **Vetor:** Como o atacante obteve acesso? A vulnerabilidade está contida?
5. **Documentar tudo** em relatório interno com timeline, evidências e decisões tomadas.

**Critério de notificação obrigatória (LGPD art. 48):** Se o incidente puder acarretar risco ou dano relevante aos titulares, a notificação à ANPD e aos titulares é obrigatória.

### 4.3 Notificação à ANPD (Até 3 dias úteis — Resolução CD/ANPD nº 15/2024)

**Prazo:** 3 dias úteis contados a partir do conhecimento do incidente.

O DPO deve submeter a Comunicação de Incidente de Segurança (CIS) via formulário eletrônico no portal da ANPD (https://www.gov.br/anpd), contendo no mínimo as informações do Formulário na Seção 5.

Se não for possível fornecer todas as informações no prazo, enviar comunicação preliminar e complementar em até 20 dias úteis.

### 4.4 Notificação aos Titulares

Comunicar aos titulares afetados em linguagem clara e acessível:

- **O que aconteceu** — descrição simples do incidente.
- **Quais dados foram afetados** — tipos de dados pessoais envolvidos.
- **Quais riscos** — possíveis consequências para o titular.
- **O que estamos fazendo** — medidas técnicas e administrativas adotadas.
- **O que o titular pode fazer** — ações recomendadas (trocar senha, monitorar movimentações).
- **Canal de contato** — dpo@raiseadv.com.br para dúvidas.

**Canais de notificação:** E-mail individual para cada titular afetado. Se inviável, aviso em destaque na plataforma + comunicado público.

**Escritórios clientes:** Se dados protegidos por sigilo advocatício foram afetados, notificar o responsável do escritório cliente diretamente por telefone e e-mail, antes da comunicação genérica aos titulares.

### 4.5 Remediação

1. **Causa raiz:** Identificar e documentar a vulnerabilidade explorada.
2. **Correção:** Implementar patch, atualizar configurações, revogar e rotacionar credenciais.
3. **Verificação:** Testar que a correção resolve a vulnerabilidade sem introduzir regressões.
4. **Hardening adicional:** Aplicar controles preventivos para mitigar vetores similares.

### 4.6 Post-Mortem (Até 10 dias úteis após encerramento)

1. **Timeline completa** do incidente (detecção → contenção → resolução).
2. **Causa raiz** e fatores contribuintes.
3. **O que funcionou** no processo de resposta.
4. **O que falhou** ou pode melhorar.
5. **Ações corretivas** com responsável e prazo.
6. **Atualização deste plano** se necessário.

O relatório de post-mortem é documento interno e confidencial.

---

## 5. Formulário de Notificação à ANPD (Template)

Conforme LGPD art. 48 §1º e Resolução CD/ANPD nº 15/2024:

```
COMUNICAÇÃO DE INCIDENTE DE SEGURANÇA (CIS)

1. IDENTIFICAÇÃO DO CONTROLADOR
   Razão social: RaiseAdv Tecnologia Ltda.
   CNPJ: [PREENCHER]
   Encarregado (DPO): [Nome]
   E-mail do DPO: dpo@raiseadv.com.br
   Telefone: [PREENCHER]

2. DESCRIÇÃO DO INCIDENTE
   Data/hora da ocorrência: [DD/MM/AAAA HH:MM]
   Data/hora do conhecimento pelo controlador: [DD/MM/AAAA HH:MM]
   Descrição do incidente: [Narrar de forma objetiva o que ocorreu]
   Tipo: [ ] Acesso não autorizado  [ ] Vazamento  [ ] Perda  [ ] Ransomware  [ ] Outro: ___

3. DADOS PESSOAIS AFETADOS
   Natureza dos dados: [ ] Cadastrais  [ ] Financeiros  [ ] Sensíveis  [ ] Dados sob sigilo advocatício
   Categorias de titulares: [ ] Clientes de escritórios  [ ] Advogados  [ ] Colaboradores
   Número estimado de titulares afetados: [PREENCHER]

4. MEDIDAS TÉCNICAS E DE SEGURANÇA
   Medidas de segurança existentes antes do incidente:
   - [Ex.: Criptografia AES-256 em repouso, TLS 1.3 em trânsito, MFA habilitado]
   Medidas adotadas após o incidente:
   - [Ex.: Isolamento do sistema, revogação de credenciais, patch aplicado]

5. RISCOS E CONSEQUÊNCIAS
   Possíveis consequências para os titulares:
   - [Ex.: Exposição de informações de processos judiciais, risco de fraude]
   Avaliação de gravidade: [ ] Crítico  [ ] Alto  [ ] Médio  [ ] Baixo

6. COMUNICAÇÃO AOS TITULARES
   Titulares já foram notificados? [ ] Sim — Data: ___  [ ] Não — Justificativa: ___
   Meio de comunicação utilizado: [ ] E-mail  [ ] Plataforma  [ ] Outro: ___

7. MEDIDAS DE MITIGAÇÃO
   Ações para reverter ou mitigar os efeitos do incidente:
   - [PREENCHER]
   Prazo estimado para conclusão: [PREENCHER]
```

---

## 6. Contatos

| Recurso | Contato |
|---------|---------|
| **DPO RaiseAdv** | dpo@raiseadv.com.br |
| **CTO RaiseAdv** | cto@raiseadv.com.br |
| **Jurídico RaiseAdv** | juridico@raiseadv.com.br |
| **ANPD — Comunicação de Incidentes** | https://www.gov.br/anpd — Formulário eletrônico CIS |
| **ANPD — Telefone** | (61) 3411-6389 |
| **CERT.br (referência técnica)** | https://www.cert.br — cert@cert.br |

---

## 7. Revisão

- Este plano deve ser **revisado a cada 6 meses** ou imediatamente após um incidente.
- Próxima revisão programada: **2026-10-10**.
- Responsável pela revisão: DPO em conjunto com CTO e Jurídico.
- Todas as alterações devem ser versionadas e comunicadas à equipe de resposta.

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 2026-04-10 | Equipe de Segurança | Versão inicial |

---

*Documento confidencial — uso interno RaiseAdv.*
