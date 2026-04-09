import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { fetchFeriadosBrasilAPI } from '@/lib/brasilapi';

/**
 * POST /api/holidays/sync?year=2026
 * Busca feriados nacionais no BrasilAPI e faz upsert na tabela `holidays`.
 * Restrito a usuários autenticados (admin idealmente via service role em cron).
 */
export async function POST(request: Request) {
  // CSRF: apenas same-origin
  const h = headers();
  const origin = h.get('origin') ?? h.get('referer') ?? '';
  const host = h.get('host') ?? '';
  if (!origin.includes(host)) return new NextResponse('Forbidden', { status: 403 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get('year') ?? new Date().getFullYear());
  if (!Number.isInteger(year) || year < 2020 || year > 2100) {
    return NextResponse.json({ error: 'invalid year' }, { status: 400 });
  }

  try {
    const feriados = await fetchFeriadosBrasilAPI(year);
    const rows = feriados.map((f) => ({
      date: f.date,
      name: f.name,
      type: 'national' as const,
      scope: 'national',
      year,
    }));
    const { error } = await supabase.from('holidays').upsert(rows, { onConflict: 'date' });
    if (error) throw error;
    return NextResponse.json({ ok: true, count: rows.length, year });
  } catch (e: any) {
    console.error('[holidays/sync]', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
