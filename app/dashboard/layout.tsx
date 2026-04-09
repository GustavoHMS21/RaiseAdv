import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Briefcase, Users, Calendar, Wallet, LayoutDashboard, LogOut, AlertTriangle } from 'lucide-react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: member } = await supabase
    .from('members')
    .select('role, organizations(name)')
    .eq('user_id', user.id)
    .maybeSingle();

  // Se o trigger de auto-provision falhou, o usuário está autenticado mas sem org.
  // Melhor mostrar erro claro do que telas vazias.
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

  const nav = [
    { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { href: '/dashboard/prazos', label: 'Prazos', icon: AlertTriangle },
    { href: '/dashboard/processos', label: 'Processos', icon: Briefcase },
    { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
    { href: '/dashboard/agenda', label: 'Agenda', icon: Calendar },
    { href: '/dashboard/financeiro', label: 'Financeiro', icon: Wallet },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <div className="h-7 w-7 rounded-md bg-brand" />
          <span className="font-semibold">JusFlow</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="text-xs text-slate-500">{(member?.organizations as any)?.name}</p>
          <p className="truncate text-sm font-medium text-slate-800">{user.email}</p>
          <form action="/api/logout" method="post" className="mt-2">
            <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900">
              <LogOut className="h-3 w-3" /> Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
