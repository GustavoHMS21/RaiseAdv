import Link from 'next/link';

export const metadata = { title: 'Política de Privacidade — JusFlow' };

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-slate">
      <Link href="/" className="text-sm text-slate-500 no-underline hover:text-slate-900">← Voltar</Link>
      <h1>Política de Privacidade</h1>
      <p className="text-sm text-slate-500">Versão 1.0 — vigente a partir de 08/04/2026</p>

      <h2>1. Quem somos</h2>
      <p>
        O JusFlow é um software jurídico fornecido em modelo SaaS. Esta política descreve como
        coletamos, usamos, armazenamos e protegemos dados pessoais, em conformidade com a
        <strong> Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong>, o
        <strong> Marco Civil da Internet (Lei nº 12.965/2014)</strong>, e o
        <strong> Estatuto da Advocacia (Lei nº 8.906/1994)</strong>.
      </p>

      <h2>2. Dados tratados</h2>
      <ul>
        <li><strong>Cadastrais:</strong> nome, email, senha (hash), nome do escritório.</li>
        <li><strong>Operacionais:</strong> processos, clientes, prazos, movimentações, lançamentos financeiros inseridos por você.</li>
        <li><strong>Técnicos:</strong> IP, user-agent, logs de acesso (retenção de 6 meses — art. 15 MCI).</li>
      </ul>

      <h2>3. Base legal (art. 7º LGPD)</h2>
      <ul>
        <li><strong>Execução de contrato</strong> (inciso V) — para prestar o serviço contratado.</li>
        <li><strong>Cumprimento de obrigação legal</strong> (inciso II) — registros fiscais, contábeis e de log.</li>
        <li><strong>Legítimo interesse</strong> (inciso IX) — segurança, prevenção a fraude.</li>
        <li><strong>Consentimento</strong> (inciso I) — comunicações de marketing opcionais.</li>
      </ul>

      <h2>4. Sigilo profissional</h2>
      <p>
        Os dados de processos e clientes hospedados no JusFlow são protegidos pelo sigilo
        profissional do advogado (art. 7º, II do EAOAB). Nossa equipe não acessa o conteúdo de
        processos, exceto mediante solicitação expressa de suporte ou ordem judicial.
      </p>

      <h2>5. Segurança (art. 46 LGPD)</h2>
      <ul>
        <li>Criptografia em trânsito (TLS 1.3) e em repouso (AES-256).</li>
        <li>Isolamento multi-tenant via Row-Level Security no banco de dados.</li>
        <li>Backups diários com retenção de 30 dias.</li>
        <li>Senhas com no mínimo 12 caracteres, armazenadas em hash bcrypt/argon2.</li>
        <li>Autenticação em dois fatores disponível nos planos pagos.</li>
      </ul>

      <h2>6. Seus direitos (art. 18 LGPD)</h2>
      <p>Você pode, a qualquer momento:</p>
      <ul>
        <li>Confirmar a existência de tratamento;</li>
        <li>Acessar seus dados;</li>
        <li>Corrigir dados incompletos ou desatualizados;</li>
        <li>Solicitar anonimização, bloqueio ou eliminação;</li>
        <li>Solicitar portabilidade (exportação JSON/CSV);</li>
        <li>Revogar consentimento;</li>
        <li>Informações sobre compartilhamento.</li>
      </ul>
      <p>
        Para exercer: <a href="mailto:dpo@jusflow.app">dpo@jusflow.app</a>. Prazo de resposta: 15
        dias (art. 19 LGPD).
      </p>

      <h2>7. Encarregado de dados (DPO)</h2>
      <p>Contato: <a href="mailto:dpo@jusflow.app">dpo@jusflow.app</a></p>

      <h2>8. Retenção</h2>
      <p>
        Dados da conta ativa: enquanto durar o contrato. Após cancelamento: exportação
        disponível por 30 dias, depois eliminação definitiva em 90 dias, salvo obrigação legal
        de retenção (CPC art. 206 §5º — 5 anos para obrigações contratuais).
      </p>

      <h2>9. Subprocessadores</h2>
      <ul>
        <li><strong>Supabase Inc.</strong> — banco de dados, autenticação e armazenamento (servidores AWS São Paulo).</li>
        <li><strong>Vercel Inc.</strong> — hospedagem da aplicação.</li>
        <li><strong>Resend</strong> — envio de emails transacionais.</li>
      </ul>
      <p>Transferência internacional com garantias contratuais adequadas (art. 33 LGPD).</p>

      <h2>10. Alterações</h2>
      <p>
        Alterações relevantes serão comunicadas por email com antecedência mínima de 15 dias.
        Versões anteriores ficam disponíveis mediante solicitação.
      </p>
    </main>
  );
}
