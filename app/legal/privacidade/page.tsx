import Link from 'next/link';

export const metadata = { title: 'Política de Privacidade — RaiseAdv' };

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-slate">
      <Link href="/" className="text-sm text-slate-500 no-underline hover:text-slate-900">&larr; Voltar</Link>
      <h1>Política de Privacidade</h1>
      <p className="text-sm text-slate-500">Versão 2.0 — vigente a partir de 10/04/2026</p>

      <h2>1. Controlador</h2>
      <p>
        <strong>RaiseAdv</strong> (software jurídico SaaS), operado por RaiseAI Tecnologia Ltda.
        <br />Encarregado de dados (DPO): <a href="mailto:dpo@raiseadv.com.br">dpo@raiseadv.com.br</a>
        <br />Canal de atendimento ao titular: <a href="mailto:dpo@raiseadv.com.br">dpo@raiseadv.com.br</a>
      </p>
      <p>
        Esta política descreve como coletamos, usamos, armazenamos e protegemos dados pessoais,
        em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong>,
        o <strong>Marco Civil da Internet (Lei nº 12.965/2014)</strong>, e o
        <strong> Estatuto da Advocacia (Lei nº 8.906/1994)</strong>.
      </p>

      <h2>2. Dados tratados e finalidades específicas (art. 9º LGPD)</h2>
      <p>Detalhamos cada categoria de dado, sua finalidade, base legal e período de retenção:</p>

      <table>
        <thead>
          <tr>
            <th>Dado</th>
            <th>Finalidade</th>
            <th>Base legal (art. 7º)</th>
            <th>Retenção</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Email, senha (hash)</td>
            <td>Autenticação e acesso ao sistema</td>
            <td>Execução de contrato (V)</td>
            <td>Enquanto a conta existir + 6 meses</td>
          </tr>
          <tr>
            <td>Nome, CPF/CNPJ, email, telefone, endereço dos clientes do advogado</td>
            <td>Gestão de clientes para exercício regular de direitos em processo judicial</td>
            <td>Execução de contrato (V) + Exercício regular de direitos (VI)</td>
            <td>5 anos após encerramento do último caso (CC art. 206 §5º)</td>
          </tr>
          <tr>
            <td>Número CNJ, tribunal, vara, partes, andamentos</td>
            <td>Gestão de processos judiciais e cumprimento de obrigação legal</td>
            <td>Obrigação legal (II) + Exercício regular de direitos (VI)</td>
            <td>5 anos após trânsito em julgado</td>
          </tr>
          <tr>
            <td>Datas de intimação, prazos, feriados</td>
            <td>Cálculo automatizado de prazos em dias úteis (CPC art. 219)</td>
            <td>Execução de contrato (V)</td>
            <td>Enquanto o processo estiver ativo</td>
          </tr>
          <tr>
            <td>Valores, honorários, despesas</td>
            <td>Gestão financeira e cumprimento de obrigações fiscais</td>
            <td>Execução de contrato (V) + Obrigação legal (II)</td>
            <td>5 anos (CTN art. 173-174)</td>
          </tr>
          <tr>
            <td>IP, user-agent, timestamp, ação</td>
            <td>Registros de acesso (Marco Civil art. 15)</td>
            <td>Obrigação legal (II)</td>
            <td>6 meses (Marco Civil art. 15)</td>
          </tr>
          <tr>
            <td>Aceite de termos, versão, IP, timestamp</td>
            <td>Prova de consentimento (LGPD art. 8º §2º)</td>
            <td>Obrigação legal (II)</td>
            <td>Enquanto válido + 5 anos</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>Comunicações de marketing opcionais</td>
            <td>Consentimento (I)</td>
            <td>Até revogação</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Sigilo profissional (art. 7º, II — EAOAB)</h2>
      <p>
        Os dados de processos e clientes hospedados no RaiseAdv são protegidos pelo <strong>sigilo
        profissional do advogado</strong> (art. 7º, II do Estatuto da OAB). Nossa equipe técnica
        não acessa o conteúdo de processos ou dados de clientes do advogado, exceto mediante
        solicitação expressa de suporte ou ordem judicial. O acesso administrativo é registrado
        em logs de auditoria invioláveis.
      </p>

      <h2>4. Compartilhamento com terceiros (art. 9º, V — LGPD)</h2>
      <p>Compartilhamos dados exclusivamente com os seguintes subprocessadores, sob contrato de proteção de dados (DPA):</p>
      <ul>
        <li><strong>Supabase Inc.</strong> — banco de dados, autenticação e armazenamento (servidores AWS São Paulo, sa-east-1).</li>
        <li><strong>Vercel Inc.</strong> — hospedagem da aplicação (edge network global, dados em sa-east-1 quando disponível).</li>
        <li><strong>Resend</strong> — envio de emails transacionais e de marketing.</li>
        <li><strong>DataJud/CNJ</strong> — consulta a dados públicos de processos judiciais (fonte pública, sem envio de dados pessoais).</li>
      </ul>
      <p>
        Transferência internacional: dados podem transitar por servidores fora do Brasil sob
        garantias contratuais adequadas (art. 33, II-a LGPD — cláusulas contratuais padrão).
      </p>

      <h2>5. Segurança (art. 46 LGPD)</h2>
      <ul>
        <li>Criptografia em trânsito (TLS 1.3) e em repouso (AES-256).</li>
        <li>Isolamento multi-tenant via Row-Level Security (RLS) no banco de dados.</li>
        <li>Backups diários com retenção de 30 dias.</li>
        <li>Senhas armazenadas em hash bcrypt com salt.</li>
        <li>Headers de segurança: CSP, X-Frame-Options, X-Content-Type-Options.</li>
        <li>Rate limiting em endpoints sensíveis (login, signup, API).</li>
        <li>Plano de resposta a incidentes conforme art. 48 LGPD e Resolução CD/ANPD nº 15/2024.</li>
      </ul>

      <h2>6. Seus direitos (art. 18 LGPD)</h2>
      <p>Você pode, a qualquer momento, exercer os seguintes direitos:</p>
      <ul>
        <li><strong>Confirmação e acesso</strong> — confirmar a existência de tratamento e acessar seus dados;</li>
        <li><strong>Correção</strong> — corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li><strong>Anonimização, bloqueio ou eliminação</strong> — de dados desnecessários ou tratados em desconformidade;</li>
        <li><strong>Portabilidade</strong> — exportação completa em formato JSON via painel ou API (<code>GET /api/lgpd</code>);</li>
        <li><strong>Eliminação de dados tratados com consentimento</strong> — exceto quando houver obrigação legal de retenção;</li>
        <li><strong>Informação sobre compartilhamento</strong> — saber com quais entidades seus dados são compartilhados;</li>
        <li><strong>Revogação de consentimento</strong> — retirar consentimento para marketing a qualquer momento.</li>
      </ul>
      <p>
        <strong>Como exercer:</strong> email para <a href="mailto:dpo@raiseadv.com.br">dpo@raiseadv.com.br</a> ou
        via painel em Configurações &gt; Meus Dados &gt; Direitos LGPD.
        <br /><strong>Prazo de resposta:</strong> 15 dias (art. 19 LGPD). Solicitações complexas podem demandar prazo adicional com justificativa.
      </p>

      <h2>7. Retenção e exclusão</h2>
      <ul>
        <li><strong>Conta ativa:</strong> dados mantidos enquanto durar o contrato.</li>
        <li><strong>Cancelamento:</strong> exportação disponível por 30 dias, depois eliminação definitiva em até 90 dias.</li>
        <li><strong>Obrigação legal:</strong> dados retidos conforme prazos legais (CPC 5 anos, CTN 5 anos, MCI 6 meses).</li>
        <li><strong>Logs de acesso:</strong> eliminados automaticamente após 6 meses (Marco Civil art. 15).</li>
      </ul>

      <h2>8. Cookies e tecnologias de rastreamento</h2>
      <p>
        Utilizamos apenas cookies essenciais para autenticação (session token httpOnly, secure).
        Não utilizamos cookies de rastreamento, analytics de terceiros ou pixels de conversão.
      </p>

      <h2>9. Incidentes de segurança (art. 48 LGPD)</h2>
      <p>
        Em caso de incidente que possa acarretar risco ou dano relevante aos titulares,
        notificaremos a ANPD em até 3 dias úteis (Resolução CD/ANPD nº 15/2024) e os
        titulares afetados em linguagem clara, informando: natureza dos dados, medidas
        técnicas adotadas e orientações para mitigar riscos.
      </p>

      <h2>10. Alterações</h2>
      <p>
        Alterações relevantes serão comunicadas por email com antecedência mínima de 15 dias.
        Versões anteriores ficam disponíveis mediante solicitação ao DPO.
      </p>

      <p className="text-sm text-slate-400 mt-12">
        Última atualização: 10 de abril de 2026. Versão 2.0.
      </p>
    </main>
  );
}
