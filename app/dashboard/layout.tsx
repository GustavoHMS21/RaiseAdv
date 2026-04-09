import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: member } = await supabase
    .from('members')
    .select('role, organizations(name)')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!member) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-lg font-semibold">Conta sem organização</h1>
        <p className="mt-2 text-sm text-slate-600">
          Seu cadastro não finalizou corretamente. Entre em contato com o suporte.
        </p>
        <form action="/api/logout" method="post" className="mt-4">
          <button className="text-sm text-brand underline">Sair</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        orgName={(member?.organizations as any)?.name}
        userEmail={user.email}
      />
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
