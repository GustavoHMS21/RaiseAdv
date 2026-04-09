import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/lgpd/export
 * Art. 18, II + V LGPD — direito de acesso e portabilidade.
 * Retorna JSON completo dos dados do usuário e sua organização.
 */
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { data: member } = await supabase
    .from('members')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!member) return new NextResponse('No org', { status: 404 });

  // RLS já restringe por org — queries não precisam filtrar manualmente.
  const [org, clients, cases, movements, events, finance] = await Promise.all([
    supabase.from('organizations').select('*').eq('id', member.organization_id).single(),
    supabase.from('clients').select('*'),
    supabase.from('cases').select('*'),
    supabase.from('case_movements').select('*'),
    supabase.from('events').select('*'),
    supabase.from('finance_entries').select('*'),
  ]);

  const payload = {
    exported_at: new Date().toISOString(),
    lgpd_article: 'Art. 18, II + V — Lei 13.709/2018',
    user: { id: user.id, email: user.email, created_at: user.created_at },
    role: member.role,
    organization: org.data,
    clients: clients.data,
    cases: cases.data,
    case_movements: movements.data,
    events: events.data,
    finance_entries: finance.data,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="jusflow-export-${new Date().toISOString().slice(0,10)}.json"`,
    },
  });
}
