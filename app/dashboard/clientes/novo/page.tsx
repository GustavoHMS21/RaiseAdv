import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { clientSchema } from '@/lib/validators';
import { logAccess } from '@/lib/access-log';
import { getAuthContext } from '@/lib/actions';
import { formStr } from '@/lib/utils';

async function create(formData: FormData) {
  'use server';
  const parsed = clientSchema.safeParse({
    type: formStr(formData.get('type')),
    name: formStr(formData.get('name')),
    document: formStr(formData.get('document')),
    email: formStr(formData.get('email')),
    phone: formStr(formData.get('phone')),
    address: formStr(formData.get('address')),
    notes: formStr(formData.get('notes')),
  });
  if (!parsed.success) {
    redirect('/dashboard/clientes/novo?error=Dados+inv%C3%A1lidos');
  }

  const { supabase, user, orgId } = await getAuthContext();

  const { data: created, error } = await supabase.from('clients').insert({
    ...parsed.data,
    organization_id: orgId,
    created_by: user.id,
  }).select('id').single();
  if (error) {
    redirect('/dashboard/clientes/novo?error=' + encodeURIComponent(error.message));
  }
  await logAccess({ userId: user.id, action: 'data_create', resource: 'clients', resourceId: created?.id });
  revalidatePath('/dashboard/clientes');
  redirect('/dashboard/clientes');
}

export default function NovoClientePage() {
  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/clientes" className="text-sm text-slate-500 hover:text-slate-900">← Voltar</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Novo cliente</h1>

      <form action={create} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select name="type" required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="pf">Pessoa Física</option>
            <option value="pj">Pessoa Jurídica</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Nome / Razão social *</label>
          <input name="name" required minLength={2} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">CPF / CNPJ</label>
            <input name="document" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Telefone</label>
            <input name="phone" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input name="email" type="email" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Endereço</label>
          <input name="address" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Observações</label>
          <textarea name="notes" rows={3} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Link href="/dashboard/clientes" className="rounded-md border border-slate-300 px-4 py-2 text-sm">Cancelar</Link>
          <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Criar cliente</button>
        </div>
      </form>
    </div>
  );
}
