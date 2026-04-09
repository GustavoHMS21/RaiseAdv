import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  // Proteção CSRF leve: exige origin/referer do próprio host
  const h = headers();
  const origin = h.get('origin') ?? h.get('referer') ?? '';
  const host = h.get('host') ?? '';
  if (!origin.includes(host)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}
