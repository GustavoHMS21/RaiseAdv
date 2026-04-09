import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/** Retorna o supabase client + org_id do usuário logado. Redireciona para /login se não autenticado. */
export async function getAuthContext() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: member } = await supabase
    .from('members')
    .select('organization_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!member) redirect('/login');

  return { supabase, user, orgId: member.organization_id as string };
}

/** Wrapper para server actions com tratamento de erro padronizado */
export type ActionResult = { success: true } | { success: false; error: string };

export function actionError(message: string): ActionResult {
  return { success: false, error: message };
}
