import Link from 'next/link';
import { Briefcase, Users, Calendar, Wallet, LayoutDashboard, LogOut, AlertTriangle, Scale } from 'lucide-react';

interface SidebarProps {
  orgName: string | undefined;
  userEmail: string | undefined;
}

const nav = [
  { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/dashboard/prazos', label: 'Prazos', icon: AlertTriangle },
  { href: '/dashboard/processos', label: 'Processos', icon: Briefcase },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/agenda', label: 'Agenda', icon: Calendar },
  { href: '/dashboard/financeiro', label: 'Financeiro', icon: Wallet },
];

export function Sidebar({ orgName, userEmail }: SidebarProps) {
  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <Scale className="h-6 w-6 text-brand" />
        <span className="text-lg font-semibold tracking-tight text-brand">RaiseAdv</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <p className="text-xs text-slate-500">{orgName ?? 'Meu Escritório'}</p>
        <p className="truncate text-sm font-medium text-slate-800">{userEmail}</p>
        <form action="/api/logout" method="post" className="mt-2">
          <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900">
            <LogOut className="h-3 w-3" /> Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
