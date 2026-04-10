'use server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validators';
import { rateLimit } from '@/lib/rate-limit';
import { logAccess } from '@/lib/access-log';

export async function login(formData: FormData) {
  // Rate limit: 5 tentativas por IP a cada 60s
  const ip = headers().get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed } = rateLimit(`login:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!allowed) {
    redirect('/login?error=Muitas+tentativas.+Aguarde+1+minuto.');
  }

  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  });
  if (!parsed.success) redirect('/login?error=Credenciais+inv%C3%A1lidas');

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    console.error('[login]', error.message);
    redirect('/login?error=Email+ou+senha+incorretos');
  }
  await logAccess({ userId: data.user?.id, action: 'login' });
  redirect('/dashboard');
}
