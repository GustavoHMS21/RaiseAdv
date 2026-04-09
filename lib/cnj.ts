/**
 * Validação e parsing do Número Único de Processo (CNJ).
 * Base legal: Resolução CNJ nº 65/2008.
 * Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
 *   N (7) — sequencial por unidade/ano
 *   D (2) — dígito verificador (ISO 7064 Módulo 97 base 10)
 *   A (4) — ano de ajuizamento
 *   J (1) — segmento do Judiciário
 *   T (2) — tribunal
 *   R (4) — unidade de origem (órgão)
 *
 * Validação: (NNNNNNNAAAAJTR OOOO DD) mod 97 === 1
 */

export type CNJParsed = {
  raw: string;
  formatted: string;
  sequential: string;
  digit: string;
  year: string;
  segment: string;
  tribunal: string;
  origin: string;
  segmentName: string;
};

const SEGMENTS: Record<string, string> = {
  '1': 'Supremo Tribunal Federal',
  '2': 'Conselho Nacional de Justiça',
  '3': 'Superior Tribunal de Justiça',
  '4': 'Justiça Federal',
  '5': 'Justiça do Trabalho',
  '6': 'Justiça Eleitoral',
  '7': 'Justiça Militar da União',
  '8': 'Justiça dos Estados e do DF',
  '9': 'Justiça Militar Estadual',
};

/** Remove tudo que não for dígito. */
export function cnjDigits(input: string): string {
  return (input ?? '').replace(/\D+/g, '');
}

/**
 * Valida o dígito verificador via Módulo 97 base 10 (ISO 7064).
 * Implementação por partes para evitar overflow em JS (número com 20 dígitos).
 */
export function isValidCNJ(input: string): boolean {
  const d = cnjDigits(input);
  if (d.length !== 20) return false;

  // Reordenar: N(7) A(4) J(1) TR(2) O(4) D(2) → concatenar e mod 97 deve dar 1
  const n = d.slice(0, 7);
  const dig = d.slice(7, 9);
  const a = d.slice(9, 13);
  const j = d.slice(13, 14);
  const tr = d.slice(14, 16);
  const o = d.slice(16, 20);
  const reordered = n + a + j + tr + o + dig;

  // mod 97 por chunks (JS só garante 15 dígitos seguros)
  let remainder = 0;
  for (const ch of reordered) {
    remainder = (remainder * 10 + Number(ch)) % 97;
  }
  return remainder === 1;
}

/** Formata 20 dígitos crus no padrão NNNNNNN-DD.AAAA.J.TR.OOOO */
export function formatCNJ(input: string): string {
  const d = cnjDigits(input);
  if (d.length !== 20) return input;
  return `${d.slice(0, 7)}-${d.slice(7, 9)}.${d.slice(9, 13)}.${d.slice(13, 14)}.${d.slice(14, 16)}.${d.slice(16, 20)}`;
}

export function parseCNJ(input: string): CNJParsed | null {
  const d = cnjDigits(input);
  if (d.length !== 20 || !isValidCNJ(d)) return null;
  const segment = d.slice(13, 14);
  return {
    raw: d,
    formatted: formatCNJ(d),
    sequential: d.slice(0, 7),
    digit: d.slice(7, 9),
    year: d.slice(9, 13),
    segment,
    tribunal: d.slice(14, 16),
    origin: d.slice(16, 20),
    segmentName: SEGMENTS[segment] ?? 'Desconhecido',
  };
}
