'use server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { signupSchema } from '@/lib/validators';
import { rateLimit } from '@/lib/rate-limit';

export async function signup(formData: FormData) {
  // Rate limit: 3 signups por IP a cada 60s
  const ip = headers().get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed } = rateLimit(`signup:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!allowed) {
    redirect('/signup?error=Muitas+tentativas.+Aguarde+1+minuto.');
  }

  const parsed = signupSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    orgName: String(formData.get('orgName') ?? ''),
  });
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'invalid';
    redirect(`/signup?error=${encodeURIComponent(msg)}`);
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { org_name: parsed.data.orgName } },
  });

  if (error) {
    console.error('[signup]', error.message);
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Supabase com "Confirm email" ativo retorna user mas sem session.
  if (!data.session) {
    redirect('/login?notice=confirm-email');
  }
  redirect('/dashboard');
}
