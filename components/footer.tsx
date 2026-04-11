import Link from 'next/link';
import { Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-brand" />
            <span className="text-sm font-semibold text-brand">RaiseAdv</span>
            <span className="text-xs text-slate-500">© {new Date().getFullYear()}</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <Link href="/legal/privacidade" className="hover:text-slate-900">
              Privacidade
            </Link>
            <Link href="/legal/termos" className="hover:text-slate-900">
              Termos
            </Link>
            <Link href="/legal/ropa" className="hover:text-slate-900">
              ROPA
            </Link>
            <a href="/.well-known/security.txt" className="hover:text-slate-900">
              Segurança
            </a>
            <a href="mailto:dpo@raiseadv.com.br" className="hover:text-slate-900">
              DPO
            </a>
          </nav>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          RaiseAdv é uma plataforma SaaS de gestão jurídica em conformidade com a LGPD
          (Lei 13.709/2018), Marco Civil da Internet (Lei 12.965/2014) e Estatuto da OAB
          (Lei 8.906/1994). Não substitui o julgamento profissional do advogado.
        </p>
      </div>
    </footer>
  );
}
