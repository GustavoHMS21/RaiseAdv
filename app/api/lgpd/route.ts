import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/api-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAccess } from '@/lib/access-log';

// GET /api/lgpd — Export all user data (portability, LGPD art. 18-V)
export async function GET(request: NextRequest) {
  const guard = await apiGuard({ rateKey: 'lgpd-export', limit: 3 });
  if ('error' in guard) return guard.error;
  const { user, supabase } = guard;

  // Fetch all user data across tables
  const [clients, cases, events, finance, consents] = await Promise.all([
    supabase.from('clients').select('*'),
    supabase.from('cases').select('*'),
    supabase.from('events').select('*'),
    supabase.from('finance_entries').select('*'),
    supabase.from('consent_records').select('*').eq('user_id', user.id),
  ]);

  const exportData = {
    exported_at: new Date().toISOString(),
    user: { id: user.id, email: user.email },
    clients: clients.data || [],
    cases: cases.data || [],
    events: events.data || [],
    finance_entries: finance.data || [],
    consent_records: consents.data || [],
  };

  await logAccess({ userId: user.id, action: 'data_export', resource: 'all' });

  // Record the DSR
  const admin = createAdminClient();
  await admin.from('data_subject_requests').insert({
    user_id: user.id,
    request_type: 'portability',
    status: 'completed',
    details: 'Exportação automática via API',
    responded_at: new Date().toISOString(),
  });

  return NextResponse.json(exportData);
}

// POST /api/lgpd — Submit a data subject request
export async function POST(request: NextRequest) {
  const guard = await apiGuard({ rateKey: 'lgpd-request', limit: 5 });
  if ('error' in guard) return guard.error;
  const { user } = guard;

  const body = await request.json();
  const { request_type, details } = body;

  const validTypes = ['access', 'correction', 'deletion', 'anonymization', 'portability', 'revoke_consent', 'info_sharing'];
  if (!validTypes.includes(request_type)) {
    return NextResponse.json({ error: 'Tipo de solicitação inválido' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from('data_subject_requests').insert({
    user_id: user.id,
    request_type,
    details: details || null,
    status: 'pending',
  }).select().single();

  if (error) {
    return NextResponse.json({ error: 'Erro ao registrar solicitação' }, { status: 500 });
  }

  await logAccess({ userId: user.id, action: 'data_create', resource: 'data_subject_requests', resourceId: data.id });

  return NextResponse.json({ success: true, request: data }, { status: 201 });
}

// DELETE /api/lgpd — Request account deletion (LGPD art. 18-VI)
export async function DELETE(request: NextRequest) {
  const guard = await apiGuard({ rateKey: 'lgpd-delete', limit: 2 });
  if ('error' in guard) return guard.error;
  const { user } = guard;

  const admin = createAdminClient();

  // Record the deletion request (processed manually for safety)
  await admin.from('data_subject_requests').insert({
    user_id: user.id,
    request_type: 'deletion',
    status: 'pending',
    details: 'Solicitação de exclusão de conta via API',
  });

  await logAccess({ userId: user.id, action: 'data_delete', resource: 'account' });

  return NextResponse.json({
    success: true,
    message: 'Solicitação de exclusão registrada. Seus dados serão removidos em até 15 dias conforme art. 19 LGPD. Você receberá confirmação por email.',
  });
}
