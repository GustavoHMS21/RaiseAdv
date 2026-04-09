import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { classifyUrgency, URGENCY_STYLES } from '@/lib/deadlines';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default async function PrazosPage() {
  const supabase = createClient();
  const { data: deadlines } = await supabase
    .from('events')
    .select('id, title, starts_at, deadline_type, priority, done, is_legal_deadline, fulfilled_at, cases(title, cnj_number)')
    .eq('is_legal_deadline', true)
    .order('starts_at');

  const pending = deadlines?.filter((d) => !d.done) ?? [];
  const done = deadlines?.filter((d) => d.done) ?? [];

  const groups = { overdue: [] as any[], critical: [] as any[], warning: [] as any[], ok: [] as any[] };
  for (const d of pending) {
    const { urgency } = classifyUrgency(new Date(d.starts_at));
    groups[urgency].push({ ...d, urgency });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <AlertTriangle className="h-6 w-6 text-gold" />
            Prazos processuais
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {pending.length} pendentes · {groups.overdue.length} vencidos · {groups.critical.length} críticos
          </p>
        </div>
        <Link href="/dashboard/prazos/novo" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Novo prazo
        </Link>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {(['overdue','critical','warning','ok'] as const).map((key) => {
          const s = URGENCY_STYLES[key];
          return (
            <div key={key} className={`rounded-xl border border-slate-200 ${s.bg} p-4`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${s.text}`}>{s.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{groups[key].length}</p>
            </div>
          );
        })}
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Pendentes</h2>
        <ul className="space-y-2">
          {pending.length === 0 && (
            <li className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              Nenhum prazo pendente. 🎉
            </li>
          )}
          {(['overdue','critical','warning','ok'] as const).flatMap((key) =>
            groups[key].map((d: any) => {
              const s = URGENCY_STYLES[d.urgency as keyof typeof URGENCY_STYLES];
              const { daysRemaining } = classifyUrgency(new Date(d.starts_at));
              return (
                <li key={d.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg ${s.bg}`}>
                    <span className={`text-lg font-bold ${s.text}`}>{Math.abs(daysRemaining)}</span>
                    <span className={`text-[10px] ${s.text}`}>{daysRemaining < 0 ? 'atraso' : 'dias'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{d.title}</p>
                    <p className="text-xs text-slate-500">
                      {d.deadline_type && <span className="mr-2 capitalize">{d.deadline_type}</span>}
                      {d.cases?.title && <>· {d.cases.title}</>}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                    <p className="mt-1 font-mono text-xs text-slate-600">
                      {new Date(d.starts_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>

      {done.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            <CheckCircle2 className="h-4 w-4" /> Cumpridos ({done.length})
          </h2>
          <ul className="space-y-1 opacity-60">
            {done.slice(0, 10).map((d: any) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm">
                <span className="line-through">{d.title}</span>
                <time className="font-mono text-xs text-slate-500">{new Date(d.starts_at).toLocaleDateString('pt-BR')}</time>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
