import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com SERVICE_ROLE_KEY — ignora RLS completamente.
 *
 * USO EXCLUSIVO no servidor para operações que exigem acesso privilegiado:
 *   - Gravação de access_logs (sigilo judicial — RLS bloqueia INSERT para todos)
 *   - Operações administrativas que não podem depender de sessão do usuário
 *
 * NUNCA importar em Client Components ou expor ao navegador.
 * A service_role key tem acesso irrestrito ao banco.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase admin credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: { schema: 'jusflow' },
  });
}
