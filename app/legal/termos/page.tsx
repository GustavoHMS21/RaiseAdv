import Link from 'next/link';

export const metadata = { title: 'Termos de Uso — RaiseAdv' };

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-slate">
      <Link href="/" className="text-sm text-slate-500 no-underline hover:text-slate-900">&larr; Voltar</Link>
      <h1>Termos de Uso</h1>
      <p className="text-sm text-slate-500">Versão 2.0 — vigente a partir de 10/04/2026</p>

      <h2>1. Aceitação</h2>
      <p>
        Ao criar uma conta, você declara ser advogado regularmente inscrito na OAB ou
        representante autorizado de escritório de advocacia, e concorda com estes Termos, a
        <Link href="/legal/privacidade"> Política de Privacidade</Link> e o
        Código de Ética e Disciplina da OAB.
      </p>

      <h2>2. Definições</h2>
      <ul>
        <li><strong>Controlador:</strong> RaiseAI Tecnologia Ltda., que determina as finalidades e meios de tratamento de dados pessoais dos usuários da plataforma.</li>
        <li><strong>Operador (Processador):</strong> RaiseAdv atua como operador dos dados de clientes inseridos pelo advogado na plataforma, processando-os exclusivamente conforme instruções do controlador (o advogado).</li>
        <li><strong>Titular:</strong> pessoa natural a quem se referem os dados pessoais.</li>
        <li><strong>Subprocessadores:</strong> Supabase Inc., Vercel Inc., Resend — conforme detalhado na Política de Privacidade.</li>
      </ul>

      <h2>3. Natureza do serviço</h2>
      <p>
        O RaiseAdv é ferramenta de apoio à gestão de escritórios jurídicos. <strong>Não
        substitui</strong> o julgamento profissional do advogado. Cálculos de prazos, resumos,
        sugestões e consultas a bases públicas são auxiliares — a conferência final é
        responsabilidade exclusiva do usuário, conforme art. 32 da Lei 8.906/1994 (EAOAB).
      </p>

      <h2>4. Sigilo profissional e proteção de dados</h2>
      <p>
        Os dados de processos e clientes inseridos pelo advogado estão protegidos pelo
        <strong> sigilo profissional</strong> (art. 7º, II do EAOAB) e pela LGPD. O RaiseAdv:
      </p>
      <ul>
        <li>Não acessa, analisa ou utiliza o conteúdo dos dados do advogado para fins próprios;</li>
        <li>Processa dados exclusivamente conforme instruções do advogado (controlador);</li>
        <li>Mantém isolamento multi-tenant via Row-Level Security no banco de dados;</li>
        <li>Garante que funcionários com acesso técnico estão sob obrigação de confidencialidade;</li>
        <li>Notifica o advogado em caso de incidente de segurança conforme art. 48 LGPD.</li>
      </ul>

      <h2>5. Acordo de Processamento de Dados (DPA)</h2>
      <p>
        Para os dados de clientes do advogado inseridos na plataforma, o advogado é o
        <strong> controlador</strong> e o RaiseAdv é o <strong>operador</strong> (art. 5º, VII LGPD).
        Este DPA simplificado faz parte integrante destes Termos:
      </p>
      <ul>
        <li>O operador trata dados pessoais apenas conforme instruções documentadas do controlador;</li>
        <li>Medidas técnicas e organizacionais: conforme Seção 5 da Política de Privacidade;</li>
        <li>Subprocessadores autorizados: conforme Seção 4 da Política de Privacidade;</li>
        <li>Assistência ao controlador: no exercício de direitos dos titulares (art. 18 LGPD) e em notificações de incidente;</li>
        <li>Devolução e eliminação: ao término do contrato, dados exportáveis por 30 dias, eliminados em 90 dias.</li>
      </ul>

      <h2>6. Uso adequado</h2>
      <p>É vedado:</p>
      <ul>
        <li>Compartilhar credenciais;</li>
        <li>Usar a plataforma para atividades ilícitas;</li>
        <li>Inserir conteúdo protegido por sigilo que não esteja sob sua responsabilidade profissional;</li>
        <li>Automatizar requisições de forma abusiva (scraping, DDoS);</li>
        <li>Tentar contornar isolamento multi-tenant ou controles de segurança.</li>
      </ul>

      <h2>7. Direito de arrependimento (art. 49 CDC)</h2>
      <p>
        Conforme o <strong>Código de Defesa do Consumidor (art. 49)</strong>, o usuário que
        contratar plano pago fora do estabelecimento comercial (contratação online) tem direito
        de desistir no prazo de <strong>7 (sete) dias corridos</strong> a contar da contratação,
        com reembolso integral do valor pago, sem necessidade de justificativa.
      </p>
      <p>
        Para exercer: envie email para <a href="mailto:suporte@raiseadv.com.br">suporte@raiseadv.com.br</a> ou
        utilize o botão &quot;Cancelar assinatura&quot; no painel, dentro do prazo de 7 dias.
      </p>

      <h2>8. Planos e pagamento</h2>
      <ul>
        <li><strong>Free:</strong> 1 usuário, 10 processos.</li>
        <li><strong>Pro — R$ 49/mês:</strong> 1 usuário, processos ilimitados.</li>
        <li><strong>Team — R$ 89/mês:</strong> até 5 usuários.</li>
      </ul>
      <p>
        Cobrança mensal recorrente. Cancelamento a qualquer tempo, sem multa, com efeito
        no ciclo seguinte. Aplicável o direito de arrependimento do art. 49 CDC nos primeiros
        7 dias.
      </p>

      <h2>9. Disponibilidade (SLA)</h2>
      <p>
        Nos comprometemos a manter o serviço com SLA de <strong>99,5% mensal</strong> de
        disponibilidade. Indisponibilidades programadas serão comunicadas com antecedência
        mínima de 48 horas. Não há garantia de funcionamento ininterrupto. Em caso de
        descumprimento reiterado do SLA, o usuário pode rescindir sem ônus.
      </p>

      <h2>10. Limitação de responsabilidade</h2>
      <p>
        Na máxima extensão permitida pelo Código Civil (arts. 186, 927), nossa responsabilidade
        total fica limitada ao valor pago pelo usuário nos últimos 12 meses. Não respondemos por
        lucros cessantes, perda de causa processual ou dano moral decorrente de uso
        inadequado da ferramenta, inclusive falha do usuário em revisar cálculos de prazo.
      </p>

      <h2>11. Propriedade intelectual</h2>
      <p>
        O código-fonte, marca, layout e design do RaiseAdv são de propriedade exclusiva da
        empresa. Os <strong>dados inseridos pelo usuário</strong> permanecem de sua propriedade
        e podem ser exportados a qualquer momento (portabilidade — art. 18, V LGPD).
      </p>

      <h2>12. Rescisão</h2>
      <p>
        Podemos suspender ou encerrar contas que violem estes Termos, mediante notificação
        prévia de 7 dias, exceto em casos de risco iminente à segurança ou ilegalidade
        manifesta. Ao encerrar, o usuário terá 30 dias para exportar seus dados.
      </p>

      <h2>13. Foro</h2>
      <p>
        Fica eleito o foro da comarca do contratante para dirimir controvérsias, nos termos
        do art. 46 do CPC, assegurado ao consumidor o foro de seu domicílio (art. 101, I CDC).
      </p>

      <p className="text-sm text-slate-400 mt-12">
        Última atualização: 10 de abril de 2026. Versão 2.0.
      </p>
    </main>
  );
}
