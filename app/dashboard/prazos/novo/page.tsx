import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deadlineSchema } from '@/lib/validators';
import { addBusinessDays, addCalendarDays, DEADLINE_PRESETS } from '@/lib/deadlines';
import { logAccess } from '@/lib/access-log';
import { getAuthContext } from '@/lib/actions';
import { formStr } from '@/lib/utils';
import DeadlineCalcClient from './calc-client';

async function create(formData: FormData) {
  'use server';
  const sourceDate = formStr(formData.get('source_date'));
  const days = Number(formData.get('days') ?? 0);
  const businessDaysOnly = formData.get('business_days_only') === 'on';
  let startsAt = formStr(formData.get('starts_at')) ?? '';

  // Fonte da verdade: recalcular no servidor.
  if (sourceDate && days > 0) {
    const [y, m, d] = sourceDate.split('-').map(Number);
    if (y && m && d) {
      const base = new Date(y, m - 1, d, 12, 0, 0);
      const computed = businessDaysOnly ? addBusinessDays(base, days) : addCalendarDays(base, days);
      startsAt = computed.toISOString();
    }
  }
  if (!startsAt) redirect('/dashboard/prazos/novo?error=Informe+a+data+base+e+os+dias');

  const parsed = deadlineSchema.safeParse({
    title: formStr(formData.get('title')),
    kind: 'deadline',
    case_id: formStr(formData.get('case_id')),
    deadline_type: formStr(formData.get('deadline_type')),
    source_date: sourceDate,
    days,
    business_days_only: businessDaysOnly,
    starts_at: startsAt,
    priority: formStr(formData.get('priority')) ?? 'high',
    is_legal_deadline: true,
    notes: formStr(formData.get('notes')),
  });
  if (!parsed.success) {
    redirect('/dashboard/prazos/novo?error=Dados+inv%C3%A1lidos');
  }

  const { supabase, user, orgId } = await getAuthContext();

  const { data: created, error } = await supabase.from('events').insert({
    organization_id: orgId,
    case_id: parsed.data.case_id,
    title: parsed.data.title,
    kind: 'deadline',
    starts_at: parsed.data.starts_at,
    priority: parsed.data.priority,
    is_legal_deadline: true,
    deadline_type: parsed.data.deadline_type,
    source_date: parsed.data.source_date,
    business_days_only: parsed.data.business_days_only,
    notes: parsed.data.notes,
    created_by: user.id,
  }).select('id').single();
  if (error) {
    redirect('/dashboard/prazos/novo?error=' + encodeURIComponent(error.message));
  }
  await logAccess({ userId: user.id, action: 'data_create', resource: 'events', resourceId: created?.id, metadata: { kind: 'deadline' } });
  revalidatePath('/dashboard/prazos');
  revalidatePath('/dashboard');
  redirect('/dashboard/prazos');
}

export default async function NovoPrazoPage() {
  const supabase = createClient();
  const { data: cases } = await supabase.from('cases').select('id, title').eq('status', 'active').order('title');

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/prazos" className="text-sm text-slate-500 hover:text-slate-900">← Voltar</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Novo prazo processual</h1>
      <p className="mt-1 text-sm text-slate-600">Informe a data da intimação e o tipo de prazo — calculamos a data-limite em dias úteis automaticamente.</p>

      <form action={create} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label className="text-sm font-medium">Descrição *</label>
          <input name="title" required placeholder="Ex: Contestação - Silva vs. Banco X" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Processo vinculado</label>
          <select name="case_id" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="">— Nenhum —</option>
            {cases?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <DeadlineCalcClient presets={DEADLINE_PRESETS} />

        <div>
          <label className="text-sm font-medium">Prioridade</label>
          <select name="priority" defaultValue="high" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="normal">Normal</option>
            <option value="low">Baixa</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Observações</label>
          <textarea name="notes" rows={3} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href="/dashboard/prazos" className="rounded-md border border-slate-300 px-4 py-2 text-sm">Cancelar</Link>
          <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Criar prazo</button>
        </div>
      </form>
    </div>
  );
}
