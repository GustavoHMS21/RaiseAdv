'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { acceptLgpdConsent } from './lgpd-actions';

export function LgpdConsentBanner({ needsConsent }: { needsConsent: boolean }) {
  const [visible, setVisible] = useState(needsConsent);
  const [isPending, startTransition] = useTransition();

  if (!visible) return null;

  function handleAccept() {
    startTransition(async () => {
      const result = await acceptLgpdConsent();
      if (result.success) setVisible(false);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-900">
          Consentimento de Dados — LGPD
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Para utilizar o RaiseAdv, precisamos do seu consentimento para o tratamento de dados
          pessoais conforme a <strong>Lei Geral de Proteção de Dados (Lei 13.709/2018)</strong>.
        </p>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
          <p className="font-medium text-slate-800">Dados que coletamos e tratamos:</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Email e dados de autenticação (art. 7º, I — execução do contrato)</li>
            <li>Dados de clientes e processos que você cadastrar (art. 7º, V — legítimo interesse)</li>
            <li>Logs de acesso para segurança e auditoria (art. 7º, IX — prevenção à fraude)</li>
          </ul>
          <p className="mt-3 font-medium text-slate-800">Seus direitos (art. 18):</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Acesso, correção e exclusão dos seus dados</li>
            <li>Portabilidade (exportar seus dados em JSON)</li>
            <li>Revogar consentimento a qualquer momento</li>
          </ul>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Ao clicar em &quot;Aceitar&quot;, você concorda com nossos{' '}
          <Link href="/legal/termos" className="text-brand underline" target="_blank">
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link href="/legal/privacidade" className="text-brand underline" target="_blank">
            Política de Privacidade
          </Link>.
        </p>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleAccept} disabled={isPending} className="flex-1">
            {isPending ? 'Salvando...' : 'Aceitar e continuar'}
          </Button>
          <form action="/api/logout" method="post">
            <Button type="submit" variant="ghost" size="md">
              Não aceito — sair
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
