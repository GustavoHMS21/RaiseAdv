import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { logAccess } from '@/lib/access-log';

export async function POST(request: Request) {
  // Proteção CSRF leve: exige origin/referer do próprio host
  const h = headers();
  const origin = h.get('origin') ?? h.get('referer') ?? '';
  const host = h.get('host') ?? '';
  if (!origin.includes(host)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.auth.signOut();

  if (user) {
    await logAccess({ userId: user.id, action: 'logout' });
  }

  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}
