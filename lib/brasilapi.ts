/**
 * Integração com BrasilAPI — feriados nacionais oficiais.
 * Docs: https://brasilapi.com.br/docs
 * Endpoint: GET /api/feriados/v1/{ano} → Array<{ date, name, type }>
 *
 * Fallback: lista estática em `deadlines.ts`.
 * Estratégia: buscar no startup e cachear em memória + persistir em `holidays`.
 */

export type BrasilAPIFeriado = {
  date: string; // YYYY-MM-DD
  name: string;
  type: 'national' | 'state' | 'municipal';
};

const BASE = 'https://brasilapi.com.br/api/feriados/v1';

export async function fetchFeriadosBrasilAPI(year: number): Promise<BrasilAPIFeriado[]> {
  const res = await fetch(`${BASE}/${year}`, {
    // Cache por 24h — feriados não mudam
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`BrasilAPI ${res.status}`);
  return (await res.json()) as BrasilAPIFeriado[];
}

/** Busca múltiplos anos em paralelo e retorna Set de datas ISO. */
export async function fetchHolidaySet(years: number[]): Promise<Set<string>> {
  const results = await Promise.allSettled(years.map((y) => fetchFeriadosBrasilAPI(y)));
  const set = new Set<string>();
  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const f of r.value) set.add(f.date);
    }
  }
  return set;
}
