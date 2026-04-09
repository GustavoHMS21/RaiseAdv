import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { financeSchema } from '@/lib/validators';

function s(v: FormDataEntryValue | null): string | null {
  if (v === null) return null;
  const str = typeof v === 'string' ? v.trim() : '';
  return str === '' ? null : str;
}

async function create(formData: FormData) {
  'use server';
  const parsed = financeSchema.safeParse({
    kind: s(formData.get('kind')),
    description: s(formData.get('description')),
    amount_reais: Number(String(formData.get('amount_reais') ?? '0').replace(',', '.')),
    due_date: s(formData.get('due_date')),
    paid_at: s(formData.get('paid_at')),
    case_id: s(formData.get('case_id')),
    client_id: s(formData.get('client_id')),
  });
  if (!parsed.success) {
    console.error('[financeiro/novo]', parsed.error.issues);
    redirect('/dashboard/financeiro/novo?error=Dados+inv%C3%A1lidos');
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: member } = await supabase.from('members').select('organization_id').eq('user_id', user.id).maybeSingle();
  if (!member) redirect('/login');

  const { error } = await supabase.from('finance_entries').insert({
    organization_id: member.organization_id,
    kind: parsed.data.kind,
    description: parsed.data.description,
    amount_cents: Math.round(parsed.data.amount_reais * 100),
    due_date: parsed.data.due_date || null,
    paid_at: parsed.data.paid_at || null,
    case_id: parsed.data.case_id || null,
    client_id: parsed.data.client_id || null,
    created_by: user.id,
  });
  if (error) {
    console.error('[financeiro/novo]', error.message);
    redirect('/dashboard/financeiro/novo?error=' + encodeURIComponent(error.message));
  }
  revalidatePath('/dashboard/financeiro');
  redirect('/dashboard/financeiro');
}

export default async function NovoLancamentoPage() {
  const supabase = createClient();
  const [{ data: cases }, { data: clients }] = await Promise.all([
    supabase.from('cases').select('id, title').order('title'),
    supabase.from('clients').select('id, name').order('name'),
  ]);

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/financeiro" className="text-sm text-slate-500 hover:text-slate-900">← Voltar</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Novo lançamento</h1>

      <form action={create} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Tipo *</label>
            <select name="kind" required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="income">Receita (honorário)</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Valor (R$) *</label>
            <input name="amount_reais" required type="text" inputMode="decimal" placeholder="0,00" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Descrição *</label>
          <input name="description" required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Vencimento</label>
            <input name="due_date" type="date" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Pago em</label>
            <input name="paid_at" type="date" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Processo</label>
            <select name="case_id" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">—</option>
              {cases?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Cliente</label>
            <select name="client_id" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">—</option>
              {clients?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Link href="/dashboard/financeiro" className="rounded-md border border-slate-300 px-4 py-2 text-sm">Cancelar</Link>
          <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Salvar</button>
        </div>
      </form>
    </div>
  );
}
