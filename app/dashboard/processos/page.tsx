import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatBRL } from '@/lib/utils';

export default async function ProcessosPage() {
  const supabase = createClient();
  const { data: cases } = await supabase
    .from('cases')
    .select('id, title, cnj_number, status, area, value_cents, clients(name)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Processos</h1>
          <p className="mt-1 text-sm text-slate-600">{cases?.length ?? 0} registros</p>
        </div>
        <Link href="/dashboard/processos/novo"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Novo processo
        </Link>
      </div>

      {/* Mobile: card layout */}
      <div className="mt-6 space-y-3 md:hidden">
        {cases && cases.length > 0 ? cases.map((c: any) => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-slate-900">{c.title}</p>
              <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand capitalize">
                {c.status}
              </span>
            </div>
            {c.cnj_number && <p className="font-mono text-xs text-slate-500">{c.cnj_number}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              {c.clients?.name && <span>{c.clients.name}</span>}
              {c.area && <span>{c.area}</span>}
              <span className="font-mono text-xs">{formatBRL(c.value_cents || 0)}</span>
            </div>
          </div>
        )) : (
          <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500">
            Nenhum processo cadastrado. <Link href="/dashboard/processos/novo" className="text-brand hover:underline">Cadastrar o primeiro →</Link>
          </div>
        )}
      </div>

      {/* Desktop: table layout */}
      <div className="mt-6 hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Título</th>
              <th className="px-5 py-3">CNJ</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Área</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases && cases.length > 0 ? cases.map((c: any) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{c.title}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.cnj_number || '—'}</td>
                <td className="px-5 py-3 text-slate-700">{c.clients?.name || '—'}</td>
                <td className="px-5 py-3 text-slate-700">{c.area || '—'}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand capitalize">
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-mono text-xs">{formatBRL(c.value_cents || 0)}</td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                Nenhum processo cadastrado. <Link href="/dashboard/processos/novo" className="text-brand hover:underline">Cadastrar o primeiro →</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
