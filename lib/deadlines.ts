/**
 * Cálculo de prazos processuais — CPC/2015.
 * Regras implementadas:
 *  - Art. 219: prazos em dias úteis.
 *  - Art. 224 §1º: se a intimação cai em dia não útil, considera-se feita no 1º dia útil seguinte.
 *  - Art. 224 §3º: dia do começo é excluído, dia do vencimento incluído.
 *    Se o vencimento cair em dia não útil, prorroga para o próximo útil.
 *  - Art. 220: recesso forense (20/dez → 20/jan) suspende prazos.
 */

// Feriados nacionais 2026-2027 (ISO). Fonte secundária; tabela `holidays` no DB é canônica.
// CORREÇÃO: removido "Quarta-feira de Cinzas" (não é feriado nacional — é facultativo meio-dia).
const HOLIDAYS = new Set<string>([
  '2026-01-01', // Confraternização
  '2026-02-16', // Carnaval (segunda)
  '2026-02-17', // Carnaval (terça)
  '2026-04-03', // Sexta-feira Santa
  '2026-04-21', // Tiradentes
  '2026-05-01', // Dia do Trabalho
  '2026-06-04', // Corpus Christi
  '2026-09-07', // Independência
  '2026-10-12', // N. Sra. Aparecida
  '2026-11-02', // Finados
  '2026-11-15', // Proclamação da República
  '2026-11-20', // Consciência Negra
  '2026-12-25', // Natal
  '2027-01-01',
]);

// Recesso forense: prazos suspensos nestes intervalos (CPC 220)
const FORENSIC_RECESS: Array<[string, string]> = [
  ['2025-12-20', '2026-01-20'],
  ['2026-12-20', '2027-01-20'],
];

/** Formata Date como YYYY-MM-DD usando hora LOCAL (evita bug de timezone com toISOString). */
function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isHoliday(d: Date): boolean {
  return HOLIDAYS.has(localISO(d));
}

function isInRecess(d: Date): boolean {
  const iso = localISO(d);
  return FORENSIC_RECESS.some(([start, end]) => iso >= start && iso <= end);
}

export function isBusinessDay(date: Date): boolean {
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return false;
  if (isHoliday(date)) return false;
  if (isInRecess(date)) return false;
  return true;
}

/** Avança a data para o próximo dia útil (inclui o próprio se já for útil). */
function nextBusinessDay(date: Date): Date {
  const d = new Date(date);
  while (!isBusinessDay(d)) d.setDate(d.getDate() + 1);
  return d;
}

/**
 * Soma N dias úteis a partir da data-base (data da intimação).
 * Aplica CPC 224 §1º: se a base for dia não útil, usa o próximo útil como início.
 * Depois exclui o dia do começo e conta N dias úteis; se o vencimento cair em não útil, prorroga.
 */
export function addBusinessDays(base: Date, days: number): Date {
  // Normaliza para meio-dia local (evita drift de DST/timezone)
  let cursor = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 12, 0, 0);

  // Reposiciona base se cair em dia não útil
  cursor = nextBusinessDay(cursor);

  // Conta N dias úteis (exclui o dia do começo)
  let added = 0;
  while (added < days) {
    cursor.setDate(cursor.getDate() + 1);
    if (isBusinessDay(cursor)) added++;
  }

  // Vencimento em dia não útil → prorroga
  cursor = nextBusinessDay(cursor);
  return cursor;
}

export function addCalendarDays(base: Date, days: number): Date {
  const result = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 12, 0, 0);
  result.setDate(result.getDate() + days);
  return result;
}

export type Preset = {
  key: string;
  label: string;
  days: number;
  businessDays: boolean;
};

export const DEADLINE_PRESETS: Preset[] = [
  { key: 'contestacao',        label: 'Contestação',                      days: 15, businessDays: true },
  { key: 'contestacao_fp',     label: 'Contestação (Fazenda Pública)',    days: 30, businessDays: true },
  { key: 'reconvencao',        label: 'Réplica à contestação',            days: 15, businessDays: true },
  { key: 'apelacao',           label: 'Apelação',                         days: 15, businessDays: true },
  { key: 'agravo_instrumento', label: 'Agravo de instrumento',            days: 15, businessDays: true },
  { key: 'agravo_interno',     label: 'Agravo interno',                   days: 15, businessDays: true },
  { key: 'embargos_decl',      label: 'Embargos de declaração',           days: 5,  businessDays: true },
  { key: 'recurso_especial',   label: 'Recurso especial/extraordinário',  days: 15, businessDays: true },
  { key: 'cumprimento',        label: 'Impugnação ao cumprimento',        days: 15, businessDays: true },
  { key: 'manifestacao',       label: 'Manifestação simples',             days: 5,  businessDays: true },
  { key: 'custom',             label: 'Personalizado',                    days: 0,  businessDays: true },
];

export type Urgency = 'overdue' | 'critical' | 'warning' | 'ok';

/**
 * Classifica urgência comparando MEIA-NOITE de hoje com a data do prazo
 * (evita "flaps" perto da virada do dia e hydration mismatch).
 */
export function classifyUrgency(deadline: Date): { urgency: Urgency; daysRemaining: number } {
  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dl0 = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const daysRemaining = Math.round((dl0.getTime() - today0.getTime()) / 86_400_000);

  let urgency: Urgency = 'ok';
  if (daysRemaining < 0) urgency = 'overdue';
  else if (daysRemaining <= 3) urgency = 'critical';
  else if (daysRemaining <= 7) urgency = 'warning';

  return { urgency, daysRemaining };
}

export const URGENCY_STYLES: Record<Urgency, { bg: string; text: string; label: string }> = {
  overdue:  { bg: 'bg-rose-100',    text: 'text-rose-800',    label: 'VENCIDO' },
  critical: { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Crítico' },
  warning:  { bg: 'bg-amber-100',   text: 'text-amber-800',   label: 'Atenção' },
  ok:       { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'No prazo' },
};
