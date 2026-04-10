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
          Termos de Uso e Proteção de Dados — LGPD
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Antes de continuar, leia como o RaiseAdv trata seus dados pessoais conforme a{' '}
          <strong>Lei Geral de Proteção de Dados (Lei 13.709/2018)</strong>. O tratamento dos
          seus dados essenciais é baseado na execução do contrato e obrigações legais — não
          depende de consentimento. O consentimento abaixo é necessário apenas para
          comunicações opcionais de marketing.
        </p>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
          <p className="font-medium text-slate-800">Base legal para tratamento de dados (art. 7º LGPD):</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li><strong>Execução de contrato (art. 7º, V):</strong> email, autenticação, dados de clientes e processos que você cadastrar, cálculos de prazos, controle financeiro</li>
            <li><strong>Cumprimento de obrigação legal (art. 7º, II):</strong> logs de acesso (Marco Civil art. 15), registros fiscais, prova de consentimento</li>
            <li><strong>Exercício regular de direitos (art. 7º, VI):</strong> gestão de processos judiciais</li>
          </ul>
          <p className="mt-3 font-medium text-slate-800">Consentimento específico (art. 7º, I):</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Comunicações de marketing opcionais (newsletters) — revogável a qualquer momento</li>
          </ul>
          <p className="mt-3 font-medium text-slate-800">Seus direitos (art. 18 LGPD):</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Acesso, correção e exclusão dos seus dados</li>
            <li>Portabilidade (exportar todos os dados em JSON via painel ou API)</li>
            <li>Revogar consentimento de marketing a qualquer momento</li>
            <li>Contato DPO: dpo@raiseadv.com.br</li>
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
