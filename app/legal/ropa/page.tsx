import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'ROPA — Registro de Operações de Tratamento — RaiseAdv',
  description: 'Registro público de operações de tratamento de dados pessoais conforme art. 37 LGPD',
};

interface ProcessingActivity {
  id: string;
  activity: string;
  data_category: string;
  legal_basis: string;
  legal_reference: string;
  purpose: string;
  retention_period: string;
  shared_with: string | null;
}

const LEGAL_BASIS_LABELS: Record<string, string> = {
  contract: 'Execução de contrato',
  legal_obligation: 'Cumprimento de obrigação legal',
  legitimate_interest: 'Legítimo interesse',
  consent: 'Consentimento',
  vital_interest: 'Proteção da vida',
  public_interest: 'Interesse público',
  rights_exercise: 'Exercício regular de direitos',
};

export default async function RopaPage() {
  const supabase = createClient();
  const { data: activities } = await supabase
    .from('processing_activities')
    .select('id, activity, data_category, legal_basis, legal_reference, purpose, retention_period, shared_with')
    .order('activity');

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">&larr; Voltar</Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
        ROPA — Registro de Operações de Tratamento
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Documento público em conformidade com o art. 37 da Lei nº 13.709/2018 (LGPD).
        Lista todas as operações de tratamento de dados pessoais realizadas pelo RaiseAdv,
        suas finalidades, bases legais e prazos de retenção.
      </p>
      <p className="mt-1 text-xs text-slate-500">Última atualização: 11 de abril de 2026.</p>

      {!activities || activities.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <p className="text-sm text-slate-500">
            Registro em carregamento. Caso este texto persista, contate{' '}
            <a href="mailto:dpo@raiseadv.com.br" className="text-brand underline">
              dpo@raiseadv.com.br
            </a>.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {(activities as ProcessingActivity[]).map((a) => (
            <div key={a.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{a.activity}</h2>
              <dl className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Dados tratados</dt>
                  <dd className="mt-0.5 text-slate-700">{a.data_category}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Finalidade</dt>
                  <dd className="mt-0.5 text-slate-700">{a.purpose}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Base legal</dt>
                  <dd className="mt-0.5 text-slate-700">
                    {LEGAL_BASIS_LABELS[a.legal_basis] ?? a.legal_basis}
                    <span className="block text-xs text-slate-500">{a.legal_reference}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Retenção</dt>
                  <dd className="mt-0.5 text-slate-700">{a.retention_period}</dd>
                </div>
                {a.shared_with && (
                  <div className="md:col-span-2">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Compartilhado com</dt>
                    <dd className="mt-0.5 text-slate-700">{a.shared_with}</dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-lg bg-slate-50 p-6 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Encarregado de Dados (DPO)</p>
        <p className="mt-1">
          Para exercer seus direitos previstos no art. 18 da LGPD, contate:{' '}
          <a href="mailto:dpo@raiseadv.com.br" className="text-brand underline">
            dpo@raiseadv.com.br
          </a>
        </p>
      </div>
    </main>
  );
}
