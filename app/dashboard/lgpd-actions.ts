'use server';

import { createClient } from '@/lib/supabase/server';
import { type ActionResult } from '@/lib/actions';
import { logAccess } from '@/lib/access-log';

const CURRENT_TERMS_VERSION = 'v1.0';

/** Verifica se o usuário já deu consentimento LGPD na versão atual */
export async function checkLgpdConsent(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from('lgpd_consents')
    .select('id')
    .eq('user_id', userId)
    .eq('terms_version', CURRENT_TERMS_VERSION)
    .maybeSingle();

  return !!data;
}

/** Grava aceite LGPD do usuário logado */
export async function acceptLgpdConsent(): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Não autenticado' };

  const { error } = await supabase
    .from('lgpd_consents')
    .upsert(
      {
        user_id: user.id,
        terms_version: CURRENT_TERMS_VERSION,
        ip_address: null, // preenchido via trigger/RLS se necessário
        accepted_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,terms_version' },
    );

  if (error) {
    console.error('[lgpd-consent]', error.message);
    return { success: false, error: 'Erro ao salvar consentimento' };
  }

  await logAccess({ userId: user.id, action: 'data_create', resource: 'lgpd_consents', metadata: { version: CURRENT_TERMS_VERSION } });

  return { success: true };
}
