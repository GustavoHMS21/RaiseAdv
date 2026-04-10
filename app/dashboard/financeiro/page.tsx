import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatBRL } from '@/lib/utils';

export default async function FinanceiroPage() {
  const supabase = createClient();
  const { data: entries } = await supabase
    .from('finance_entries')
    .select('id, kind, amount_cents, description, due_date, paid_at')
    .order('created_at', { ascending: false });

  const income = entries?.filter((e) => e.kind === 'income').reduce((s, e) => s + e.amount_cents, 0) ?? 0;
  const expense = entries?.filter((e) => e.kind === 'expense').reduce((s, e) => s + e.amount_cents, 0) ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Financeiro</h1>
        <Link href="/dashboard/financeiro/novo" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Novo lançamento
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase text-slate-500">Receitas</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">{formatBRL(income)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase text-slate-500">Despesas</p>
          <p className="mt-2 text-2xl font-semibold text-rose-600">{formatBRL(expense)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase text-slate-500">Saldo</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{formatBRL(income - expense)}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Descrição</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Vencimento</th>
              <th className="px-5 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries && entries.length > 0 ? entries.map((e) => (
              <tr key={e.id}>
                <td className="px-5 py-3">{e.description}</td>
                <td className="px-5 py-3 capitalize">{e.kind === 'income' ? 'Receita' : 'Despesa'}</td>
                <td className="px-5 py-3 font-mono text-xs">{e.due_date || '—'}</td>
                <td className={`px-5 py-3 text-right font-mono text-xs ${e.kind === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatBRL(e.amount_cents)}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-500">Nenhum lançamento.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
