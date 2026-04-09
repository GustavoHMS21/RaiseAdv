import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { classifyUrgency, URGENCY_STYLES } from '@/lib/deadlines';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default async function DashboardHome() {
  const supabase = createClient();

  const [{ count: cases }, { count: clients }, { data: deadlines }] = await Promise.all([
    supabase.from('cases').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('events')
      .select('id, title, starts_at, deadline_type, cases(title)')
      .eq('is_legal_deadline', true).eq('done', false)
      .order('starts_at').limit(10),
  ]);

  const classified = (deadlines ?? []).map((d: any) => {
    const c = classifyUrgency(new Date(d.starts_at));
    return { ...d, ...c };
  });
  const overdue = classified.filter((d) => d.urgency === 'overdue');
  const critical = classified.filter((d) => d.urgency === 'critical');

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Visão geral</h1>
      <p className="mt-1 text-sm text-slate-600">Resumo do seu escritório.</p>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">Prazos vencidos</p>
          <p className="mt-2 text-3xl font-bold text-rose-700">{overdue.length}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Críticos (≤3d)</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">{critical.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Processos ativos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{cases ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Clientes</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{clients ?? 0}</p>
        </div>
      </div>

      {/* Widget: prazos críticos */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4 text-gold" />
            Próximos prazos processuais
          </h2>
          <Link href="/dashboard/prazos" className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {classified.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-slate-500">
              Nenhum prazo pendente. <Link href="/dashboard/prazos/novo" className="text-brand hover:underline">Cadastrar →</Link>
            </li>
          )}
          {classified.map((d: any) => {
            const s = URGENCY_STYLES[d.urgency as keyof typeof URGENCY_STYLES];
            return (
              <li key={d.id} className="flex items-center gap-4 px-5 py-3">
                <div className={`flex h-11 w-11 flex-col items-center justify-center rounded-lg ${s.bg}`}>
                  <span className={`text-base font-bold ${s.text}`}>{Math.abs(d.daysRemaining)}</span>
                  <span className={`text-[9px] ${s.text}`}>{d.daysRemaining < 0 ? 'atraso' : 'dias'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-slate-900">{d.title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {d.deadline_type && <span className="capitalize">{d.deadline_type}</span>}
                    {d.cases?.title && <> · {d.cases.title}</>}
                  </p>
                </div>
                <time className="font-mono text-xs text-slate-600">
                  {new Date(d.starts_at).toLocaleDateString('pt-BR')}
                </time>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
