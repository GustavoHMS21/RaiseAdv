import Link from 'next/link';
import { Scale, Shield, Clock, Users, FileText, Wallet, Lock } from 'lucide-react';

export default function Landing() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <nav className="mb-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-7 w-7 text-brand" />
          <span className="text-xl font-semibold tracking-tight text-brand">RaiseAdv</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-slate-600 hover:text-slate-900">Entrar</Link>
          <Link href="/signup" className="rounded-md bg-brand px-4 py-2 text-white hover:bg-brand-700">
            Começar grátis
          </Link>
        </div>
      </nav>

      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-gold">
          Software jurídico moderno e acessível
        </p>
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
          Seu escritório jurídico, <span className="text-brand">sob controle.</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          Processos, prazos, clientes e financeiro em um só lugar. Sem complicação, sem contrato
          anual, sem pagar R$ 200 por mês.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link href="/signup" className="rounded-md bg-brand px-6 py-3 font-medium text-white hover:bg-brand-700">
            Começar grátis
          </Link>
          <Link href="#recursos" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Ver recursos →
          </Link>
        </div>
      </section>

      <section id="recursos" className="mt-24 grid gap-6 md:grid-cols-3">
        {([
          { t: 'Processos', d: 'Cadastre pelo número CNJ e acompanhe a timeline completa.', icon: FileText },
          { t: 'Prazos & Agenda', d: 'Nunca perca um prazo. Alertas automáticos por email.', icon: Clock },
          { t: 'Clientes & Documentos', d: 'CRM jurídico completo com documentos criptografados.', icon: Users },
          { t: 'Financeiro', d: 'Honorários, contas a receber e relatórios simples.', icon: Wallet },
          { t: 'Multi-usuário', d: 'Convide sua equipe com permissões granulares.', icon: Shield },
          { t: 'Seguro por padrão', d: 'LGPD-ready. Dados criptografados e isolamento total.', icon: Lock },
        ] as const).map((f) => (
          <div key={f.t} className="rounded-xl border border-slate-200 bg-white p-6">
            <f.icon className="mb-3 h-5 w-5 text-brand" />
            <h3 className="font-semibold text-slate-900">{f.t}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.d}</p>
          </div>
        ))}
      </section>

      <footer className="mt-24 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 md:flex-row md:items-center">
        <span>&copy; {new Date().getFullYear()} RaiseAdv. Feito para advogados que valorizam seu tempo.</span>
        <div className="flex gap-4">
          <Link href="/legal/termos" className="hover:text-slate-900">Termos de uso</Link>
          <Link href="/legal/privacidade" className="hover:text-slate-900">Privacidade (LGPD)</Link>
        </div>
      </footer>
    </main>
  );
}
