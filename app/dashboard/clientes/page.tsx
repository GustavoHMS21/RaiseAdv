import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function ClientesPage() {
  const supabase = createClient();
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, type, document, email, phone')
    .order('name');

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="mt-1 text-sm text-slate-600">{clients?.length ?? 0} registros</p>
        </div>
        <Link href="/dashboard/clientes/novo"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Novo cliente
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Nome</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Documento</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Telefone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients && clients.length > 0 ? clients.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 uppercase text-xs">{c.type}</td>
                <td className="px-5 py-3 font-mono text-xs">{c.document || '—'}</td>
                <td className="px-5 py-3">{c.email || '—'}</td>
                <td className="px-5 py-3">{c.phone || '—'}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                Nenhum cliente. <Link href="/dashboard/clientes/novo" className="text-brand hover:underline">Cadastrar o primeiro →</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
