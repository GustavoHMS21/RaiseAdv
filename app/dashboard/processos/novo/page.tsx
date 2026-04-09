import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { caseSchema } from '@/lib/validators';

function s(v: FormDataEntryValue | null): string | null {
  if (v === null) return null;
  const str = typeof v === 'string' ? v.trim() : '';
  return str === '' ? null : str;
}

async function create(formData: FormData) {
  'use server';
  const valorNum = Number(String(formData.get('value_reais') ?? '0').replace(',', '.'));
  const parsed = caseSchema.safeParse({
    title: s(formData.get('title')),
    cnj_number: s(formData.get('cnj_number')),
    client_id: s(formData.get('client_id')),
    court: s(formData.get('court')),
    area: s(formData.get('area')),
    status: s(formData.get('status')) ?? 'active',
    opposing_party: s(formData.get('opposing_party')),
    value_cents: Number.isFinite(valorNum) ? Math.round(valorNum * 100) : 0,
    notes: s(formData.get('notes')),
  });
  if (!parsed.success) {
    console.error('[processos/novo]', parsed.error.issues);
    redirect('/dashboard/processos/novo?error=Dados+inv%C3%A1lidos');
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: member } = await supabase.from('members').select('organization_id').eq('user_id', user.id).maybeSingle();
  if (!member) redirect('/login');

  const { error } = await supabase.from('cases').insert({
    ...parsed.data,
    organization_id: member.organization_id,
    created_by: user.id,
  });
  if (error) {
    console.error('[processos/novo]', error.message);
    redirect('/dashboard/processos/novo?error=' + encodeURIComponent(error.message));
  }
  revalidatePath('/dashboard/processos');
  redirect('/dashboard/processos');
}

export default async function NovoProcessoPage() {
  const supabase = createClient();
  const { data: clients } = await supabase.from('clients').select('id, name').order('name');

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/processos" className="text-sm text-slate-500 hover:text-slate-900">← Voltar</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Novo processo</h1>

      <form action={create} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label className="text-sm font-medium">Título *</label>
          <input name="title" required minLength={2} placeholder="Ex: Ação de cobrança - Silva vs. Banco X" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Número CNJ</label>
            <input name="cnj_number" placeholder="0000000-00.0000.0.00.0000" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs" />
          </div>
          <div>
            <label className="text-sm font-medium">Cliente</label>
            <select name="client_id" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">— Nenhum —</option>
              {clients?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Vara / Tribunal</label>
            <input name="court" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Área</label>
            <select name="area" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">Selecione</option>
              <option>Cível</option><option>Trabalhista</option><option>Criminal</option>
              <option>Tributário</option><option>Família</option><option>Previdenciário</option>
              <option>Consumidor</option><option>Empresarial</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Parte contrária</label>
            <input name="opposing_party" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Valor da causa (R$)</label>
            <input name="value_reais" type="text" inputMode="decimal" placeholder="0,00" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <select name="status" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="active">Ativo</option><option value="archived">Arquivado</option>
            <option value="won">Ganho</option><option value="lost">Perdido</option>
            <option value="settled">Acordo</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Observações</label>
          <textarea name="notes" rows={3} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Link href="/dashboard/processos" className="rounded-md border border-slate-300 px-4 py-2 text-sm">Cancelar</Link>
          <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Criar processo</button>
        </div>
      </form>
    </div>
  );
}
