import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

/**
 * Guard padrão para API routes protegidas.
 * Verifica: CSRF, autenticação, rate-limit.
 * Retorna { user, supabase } ou NextResponse de erro.
 */
export async function apiGuard(opts?: { rateKey?: string; limit?: number }) {
  // CSRF: strict same-origin check (parse URL to prevent subdomain bypass)
  const h = headers();
  const origin = h.get('origin') ?? h.get('referer') ?? '';
  const host = h.get('host') ?? '';
  let originHost = '';
  try {
    originHost = new URL(origin).host;
  } catch {
    // malformed origin — reject
  }
  if (!host || originHost !== host) {
    return { error: new NextResponse('Forbidden', { status: 403 }) };
  }

  // Rate limit
  if (opts?.rateKey) {
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const { allowed } = rateLimit(`${opts.rateKey}:${ip}`, { limit: opts.limit ?? 10 });
    if (!allowed) {
      return { error: NextResponse.json({ error: 'Too many requests' }, { status: 429 }) };
    }
  }

  // Auth
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: new NextResponse('Unauthorized', { status: 401 }) };
  }

  return { user, supabase };
}
