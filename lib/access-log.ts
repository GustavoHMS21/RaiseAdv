import { createAdminClient } from '@/lib/supabase/admin';
import { headers } from 'next/headers';

/**
 * Registro de acesso — Marco Civil da Internet, art. 15.
 * Retenção obrigatória de 6 meses para aplicações com sigilo judicial.
 *
 * Usa service_role key porque a tabela jusflow.access_logs tem RLS
 * bloqueando todo acesso de usuário (INSERT/SELECT/UPDATE/DELETE).
 * Logs só são gravados pelo servidor, nunca expostos ao cliente.
 */

type LogAction =
  | 'login'
  | 'logout'
  | 'page_view'
  | 'data_export'
  | 'data_delete'
  | 'data_update'
  | 'data_create';

interface LogParams {
  userId?: string;
  action: LogAction;
  resource?: string;
  resourceId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAccess(params: LogParams): Promise<void> {
  try {
    const h = headers();

    // x-forwarded-for pode conter cadeia de proxies — pegar o primeiro (IP do cliente)
    const forwarded = h.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || null;

    const userAgent = h.get('user-agent') || null;

    const admin = createAdminClient();

    const { error } = await admin.from('access_logs').insert({
      user_id: params.userId || null,
      ip_address: ip,
      user_agent: userAgent,
      action: params.action,
      resource: params.resource || null,
      resource_id: params.resourceId || null,
      session_id: params.sessionId || null,
      metadata: params.metadata || {},
    });

    if (error) {
      console.error('[ACCESS_LOG] Supabase insert error:', error.message);
    }
  } catch (err) {
    // Falha no log NUNCA deve quebrar a operação principal do usuário
    console.error('[ACCESS_LOG] Failed to write:', err);
  }
}
