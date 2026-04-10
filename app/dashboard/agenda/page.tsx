import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AgendaPage() {
  const supabase = createClient();
  const { data: events } = await supabase
    .from('events')
    .select('id, title, kind, starts_at, done, cases(title)')
    .order('starts_at');

  const kindLabel: Record<string, string> = {
    deadline: 'Prazo',
    hearing: 'Audiência',
    meeting: 'Reunião',
    task: 'Tarefa',
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
          <p className="mt-1 text-sm text-slate-600">{events?.length ?? 0} compromissos</p>
        </div>
        <Link href="/dashboard/prazos/novo" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Novo prazo
        </Link>
      </div>

      <ul className="mt-6 space-y-2">
        {events && events.length > 0 ? events.map((e: any) => (
          <li key={e.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <p className="font-medium text-slate-900">{e.title}</p>
              <p className="text-xs text-slate-500">
                <span className="capitalize">{kindLabel[e.kind as string] ?? e.kind}</span>
                {e.cases?.title && <> · {e.cases.title}</>}
              </p>
            </div>
            <time className="font-mono text-xs text-slate-700">
              {new Date(e.starts_at).toLocaleString('pt-BR')}
            </time>
          </li>
        )) : (
          <li className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            Nenhum compromisso cadastrado.
          </li>
        )}
      </ul>
    </div>
  );
}
