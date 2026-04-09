# Referências legais e fontes oficiais

Todas as regras de negócio do JusFlow têm base em fonte primária brasileira.

## Constituição Federal
- **Art. 5º, XII** — inviolabilidade de dados e comunicações → justifica criptografia e sigilo.
- **Art. 5º, LXXIX** — direito à proteção de dados pessoais (EC 115/2022).
- **Art. 133** — indispensabilidade do advogado à administração da justiça.

## Leis federais aplicadas
| Norma | Uso no sistema |
|---|---|
| **Lei 8.906/1994 (Estatuto da OAB)** — art. 7º II | Sigilo profissional → RLS por organização |
| **Lei 8.906/1994** — art. 32 | Responsabilidade do advogado por atos profissionais → disclaimer sobre cálculos auxiliares |
| **Lei 12.965/2014 (Marco Civil)** — art. 15 | Retenção de logs de acesso por 6 meses |
| **Lei 13.105/2015 (CPC)** — art. 219 | Cálculo de prazos em **dias úteis** |
| **CPC** — art. 220 | **Suspensão de prazos no recesso forense** (20/dez a 20/jan) |
| **CPC** — art. 224 §1º | Intimação em dia não útil → desloca para o próximo útil |
| **CPC** — art. 224 §3º | Exclui dia do começo, inclui dia do vencimento; prorroga se cair em dia não útil |
| **CPC** — art. 46 | Foro do réu / contratante |
| **CPC** — art. 206 §5º | Prescrição de 5 anos → política de retenção de dados |
| **Lei 13.709/2018 (LGPD)** — arts. 7, 18, 19, 33, 46 | Base legal, direitos do titular, segurança, transferência internacional |
| **CC 2002** — arts. 186, 927 | Limitação de responsabilidade nos Termos |

## Resoluções e atos normativos
- **Resolução CNJ nº 65/2008** — numeração única de processos (formato NNNNNNN-DD.AAAA.J.TR.OOOO + ISO 7064 Módulo 97). Implementado em [`lib/cnj.ts`](../lib/cnj.ts).
- **Portaria CNJ nº 160/2020** — disciplina a Base Nacional de Dados do Poder Judiciário (DataJud).
- **Provimento 205/2021 CFOAB** — uso de redes sociais por advogados (para futuras features de marketing).

## Prazos específicos (CPC)
| Ato | Prazo | Artigo |
|---|---|---|
| Contestação | 15 dias úteis | 335 |
| Contestação Fazenda Pública | 30 dias úteis (prazo em dobro) | 183 |
| Embargos de declaração | 5 dias úteis | 1.023 |
| Apelação | 15 dias úteis | 1.003 §5º |
| Agravo de instrumento | 15 dias úteis | 1.003 §5º |
| Agravo interno | 15 dias úteis | 1.003 §5º |
| RE / REsp | 15 dias úteis | 1.003 §5º |
| Impugnação ao cumprimento | 15 dias úteis | 525 |

Implementado em [`lib/deadlines.ts`](../lib/deadlines.ts) `DEADLINE_PRESETS`.

## Segmentos judiciários (Res. CNJ 65/2008 art. 1º §1º)
| Código | Segmento |
|---|---|
| 1 | Supremo Tribunal Federal |
| 2 | Conselho Nacional de Justiça |
| 3 | Superior Tribunal de Justiça |
| 4 | Justiça Federal |
| 5 | Justiça do Trabalho |
| 6 | Justiça Eleitoral |
| 7 | Justiça Militar da União |
| 8 | Justiça dos Estados e do DF |
| 9 | Justiça Militar Estadual |

Persistido em `cnj_segments` ([migration 0004](../supabase/migrations/0004_holidays_sync.sql)).

## APIs externas
| API | Uso | Base legal / auth |
|---|---|---|
| [BrasilAPI `/feriados/v1/{ano}`](https://brasilapi.com.br/docs) | Feriados nacionais oficiais | Pública, sem auth |
| [DataJud CNJ API Pública](https://datajud-wiki.cnj.jus.br/api-publica/) | Consulta de processos e movimentações | Portaria CNJ 160/2020, header `APIKey` |
| Diário Oficial dos tribunais (v2) | Captura de publicações | via parceiros (Escavador/Codex) |

## Fluxo de compliance do usuário
1. **Signup** → aceita Termos v1.0 + Privacidade v1.0 → linha em `lgpd_consents` com IP/UA.
2. **Exportação** → `GET /api/lgpd/export` retorna JSON completo da organização.
3. **Exclusão** → email para `dpo@jusflow.app` → eliminação em até 90 dias (janela de 30 dias para recuperação).
4. **Logs de acesso** → retenção 6 meses conforme MCI art. 15.
