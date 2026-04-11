import { getAuthContext } from '@/lib/actions';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card } from '@/components/ui';
import { Settings, Download, FileText, Trash2, ShieldCheck } from 'lucide-react';
import { ConfigClient } from './config-client';

export const metadata = { title: 'Configurações — RaiseAdv' };

export default async function ConfiguracoesPage() {
  const { user } = await getAuthContext();
  const supabase = createClient();

  // Buscar últimas solicitações DSR do usuário
  const { data: requests } = await supabase
    .from('data_subject_requests')
    .select('id, request_type, status, requested_at, responded_at')
    .eq('user_id', user.id)
    .order('requested_at', { ascending: false })
    .limit(10);

  // Buscar consentimentos atuais
  const { data: consents } = await supabase
    .from('consent_records')
    .select('id, consent_type, version, granted_at, revoked_at')
    .eq('user_id', user.id)
    .order('granted_at', { ascending: false });

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Settings}
        title="Configurações"
        description="Gerencie seus dados, consentimentos e direitos LGPD"
      />

      <Card className="p-6">
        <div className="flex items-start gap-3">
          <Download className="h-5 w-5 text-brand mt-1" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Exportar meus dados</h2>
            <p className="mt-1 text-sm text-slate-600">
              Direito de portabilidade — LGPD art. 18, V. Faça o download de todos os
              seus dados em formato JSON estruturado.
            </p>
            <a
              href="/api/lgpd"
              download="raiseadv-meus-dados.json"
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <Download className="h-4 w-4" /> Baixar exportação JSON
            </a>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-brand mt-1" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Solicitar direito LGPD</h2>
            <p className="mt-1 text-sm text-slate-600">
              Exerça qualquer um dos direitos do art. 18 da LGPD. Resposta em até 15 dias.
            </p>
            <ConfigClient />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand" /> Histórico de consentimentos
        </h2>
        {!consents || consents.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Nenhum consentimento registrado.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {consents.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm">
                <span className="font-medium capitalize">{c.consent_type}</span>
                <span className="text-xs text-slate-500">v{c.version}</span>
                <span className="text-xs text-slate-500">
                  {new Date(c.granted_at).toLocaleDateString('pt-BR')}
                </span>
                {c.revoked_at ? (
                  <span className="text-xs text-red-600">Revogado</span>
                ) : (
                  <span className="text-xs text-emerald-600">Ativo</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900">Minhas solicitações</h2>
        {!requests || requests.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Nenhuma solicitação registrada ainda.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {requests.map((r) => (
              <li key={r.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{r.request_type.replace('_', ' ')}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    r.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                    r.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                    r.status === 'denied' ? 'bg-red-50 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Solicitado em {new Date(r.requested_at).toLocaleDateString('pt-BR')}
                  {r.responded_at && ` • Respondido em ${new Date(r.responded_at).toLocaleDateString('pt-BR')}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-6 border-red-200 bg-red-50/30">
        <div className="flex items-start gap-3">
          <Trash2 className="h-5 w-5 text-red-600 mt-1" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-900">Excluir minha conta</h2>
            <p className="mt-1 text-sm text-red-700">
              Direito de eliminação — LGPD art. 18, VI. Sua solicitação será processada
              em até 15 dias. Dados sob obrigação legal de retenção podem ser mantidos
              pelos prazos previstos em lei (CTN 5 anos, CPC 5 anos, MCI 6 meses).
            </p>
            <p className="mt-2 text-xs text-red-600">
              <strong>Atenção:</strong> esta ação é irreversível. Antes de prosseguir,
              recomendamos exportar seus dados.
            </p>
          </div>
        </div>
      </Card>

      <p className="text-xs text-slate-500">
        Dúvidas? Contate nosso DPO em{' '}
        <a href="mailto:dpo@raiseadv.com.br" className="text-brand underline">
          dpo@raiseadv.com.br
        </a>
      </p>
    </div>
  );
}
