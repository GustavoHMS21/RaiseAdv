'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validators';

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  });
  if (!parsed.success) redirect('/login?error=Credenciais+inv%C3%A1lidas');

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    console.error('[login]', error.message);
    redirect('/login?error=Email+ou+senha+incorretos');
  }
  redirect('/dashboard');
}
