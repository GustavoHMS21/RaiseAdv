/**
 * Integração com a API Pública do DataJud/CNJ.
 * Base legal: Portaria CNJ nº 160/2020.
 * Docs: https://datajud-wiki.cnj.jus.br/api-publica/
 *
 * Cada tribunal tem seu próprio endpoint Elasticsearch.
 * Autenticação via env var DATAJUD_API_KEY (nunca hardcoded).
 */

export type DataJudHit = {
  numeroProcesso: string;
  classe?: { codigo: number; nome: string };
  sistema?: { codigo: number; nome: string };
  formato?: { codigo: number; nome: string };
  tribunal: string;
  dataAjuizamento?: string;
  grau?: string;
  orgaoJulgador?: { codigo: number; nome: string };
  assuntos?: Array<{ codigo: number; nome: string }>;
  movimentos?: Array<{
    codigo: number;
    nome: string;
    dataHora: string;
  }>;
};

// Mapeamento tribunal → endpoint (amostra; expandir conforme necessidade).
// Fonte: datajud-wiki.cnj.jus.br/api-publica/acesso
const TRIBUNAL_ENDPOINTS: Record<string, string> = {
  // Justiça Estadual
  tjsp: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search',
  tjrj: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrj/_search',
  tjmg: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search',
  tjrs: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrs/_search',
  tjpr: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpr/_search',
  tjba: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjba/_search',
  // Justiça Federal
  trf1: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf1/_search',
  trf2: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf2/_search',
  trf3: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf3/_search',
  trf4: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf4/_search',
  trf5: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf5/_search',
  trf6: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf6/_search',
  // Justiça do Trabalho
  tst: 'https://api-publica.datajud.cnj.jus.br/api_publica_tst/_search',
};

export class DataJudError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

function getApiKey(): string {
  const key = process.env.DATAJUD_API_KEY;
  if (!key) {
    throw new DataJudError('DATAJUD_API_KEY não configurada. Defina no .env.local');
  }
  return key;
}

/**
 * Consulta um processo pelo número CNJ (20 dígitos) no tribunal indicado.
 * @param tribunalKey ex: 'tjsp', 'trf3'
 * @param processNumber 20 dígitos (com ou sem formatação)
 */
export async function searchProcessByCNJ(
  tribunalKey: string,
  processNumber: string
): Promise<DataJudHit | null> {
  const endpoint = TRIBUNAL_ENDPOINTS[tribunalKey.toLowerCase()];
  if (!endpoint) {
    throw new DataJudError(`Tribunal não suportado: ${tribunalKey}`);
  }

  const digits = processNumber.replace(/\D+/g, '');
  if (digits.length !== 20) {
    throw new DataJudError('Número do processo deve ter 20 dígitos');
  }

  const body = {
    query: { match: { numeroProcesso: digits } },
    size: 1,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `APIKey ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    // DataJud é rate-limited; cache 1h por consulta
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new DataJudError(`DataJud ${res.status}`, res.status);
  }

  const json = (await res.json()) as {
    hits: { hits: Array<{ _source: DataJudHit }> };
  };
  return json.hits?.hits?.[0]?._source ?? null;
}

export const SUPPORTED_TRIBUNAIS = Object.keys(TRIBUNAL_ENDPOINTS);
