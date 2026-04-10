import Link from 'next/link';

export const metadata = { title: 'Termos de Uso — RaiseAdv' };

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-slate">
      <Link href="/" className="text-sm text-slate-500 no-underline hover:text-slate-900">← Voltar</Link>
      <h1>Termos de Uso</h1>
      <p className="text-sm text-slate-500">Versão 1.0 — vigente a partir de 08/04/2026</p>

      <h2>1. Aceitação</h2>
      <p>
        Ao criar uma conta, você declara ser advogado regularmente inscrito na OAB ou
        representante autorizado de escritório de advocacia, e concorda com estes Termos, a
        <Link href="/legal/privacidade"> Política de Privacidade</Link> e o
        Código de Ética e Disciplina da OAB.
      </p>

      <h2>2. Natureza do serviço</h2>
      <p>
        O RaiseAdv é ferramenta de apoio à gestão de escritórios jurídicos. <strong>Não
        substitui</strong> o julgamento profissional do advogado. Cálculos de prazos, resumos,
        sugestões e consultas a bases públicas são auxiliares — a conferência final é
        responsabilidade exclusiva do usuário, conforme art. 32 da Lei 8.906/1994.
      </p>

      <h2>3. Uso adequado</h2>
      <p>É vedado:</p>
      <ul>
        <li>Compartilhar credenciais;</li>
        <li>Usar a plataforma para atividades ilícitas;</li>
        <li>Inserir conteúdo protegido por sigilo que não esteja sob sua responsabilidade profissional;</li>
        <li>Automatizar requisições de forma abusiva (scraping, DDoS);</li>
        <li>Tentar contornar isolamento multi-tenant ou controles de segurança.</li>
      </ul>

      <h2>4. Planos e pagamento</h2>
      <ul>
        <li><strong>Free:</strong> 1 usuário, 10 processos.</li>
        <li><strong>Pro — R$ 49/mês:</strong> 1 usuário, processos ilimitados.</li>
        <li><strong>Team — R$ 89/mês:</strong> até 5 usuários.</li>
      </ul>
      <p>Cobrança mensal recorrente. Cancelamento a qualquer tempo, sem multa, efeito no ciclo seguinte.</p>

      <h2>5. Disponibilidade</h2>
      <p>
        Nos esforçamos para manter o serviço com SLA de 99,5% mensal. Indisponibilidades
        programadas serão comunicadas com antecedência. Não há garantia implícita de
        funcionamento ininterrupto.
      </p>

      <h2>6. Limitação de responsabilidade</h2>
      <p>
        Na máxima extensão permitida pelo Código Civil (arts. 186, 927), nossa responsabilidade
        total fica limitada ao valor pago pelo usuário nos últimos 12 meses. Não respondemos por
        lucros cessantes, perda de causa processual ou dano moral decorrente de uso
        inadequado da ferramenta, inclusive falha do usuário em revisar cálculos de prazo.
      </p>

      <h2>7. Propriedade intelectual</h2>
      <p>
        O código-fonte, marca, layout e design do RaiseAdv são de propriedade exclusiva da
        empresa. Os <strong>dados inseridos pelo usuário</strong> permanecem de sua propriedade
        e podem ser exportados a qualquer momento.
      </p>

      <h2>8. Rescisão</h2>
      <p>
        Podemos suspender ou encerrar contas que violem estes Termos, mediante notificação
        prévia de 7 dias, exceto em casos de risco iminente à segurança ou ilegalidade
        manifesta.
      </p>

      <h2>9. Foro</h2>
      <p>
        Fica eleito o foro da comarca do contratante para dirimir controvérsias, nos termos
        do art. 46 do CPC.
      </p>
    </main>
  );
}
