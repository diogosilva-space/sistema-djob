import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Política de Privacidade da plataforma D.job System — como coletamos, usamos e protegemos seus dados.',
};

const SECTIONS = [
  { id: 'dados-coletados', title: 'Dados Coletados' },
  { id: 'finalidade', title: 'Finalidade do Tratamento' },
  { id: 'base-legal', title: 'Base Legal (LGPD)' },
  { id: 'compartilhamento', title: 'Compartilhamento de Dados' },
  { id: 'armazenamento', title: 'Armazenamento e Segurança' },
  { id: 'direitos', title: 'Direitos do Titular' },
  { id: 'cookies', title: 'Cookies e Tecnologias' },
  { id: 'contato', title: 'Contato e Encarregado (DPO)' },
];

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalShell
      title="Política de Privacidade"
      lastUpdated="Julho de 2026"
      sections={SECTIONS}
    >
      <section id="dados-coletados">
        <h2>1. Dados Coletados</h2>
        <p>
          A <strong>D.job Sistemas Ltda.</strong> (&quot;D.job&quot;, &quot;nós&quot;) coleta e trata
          dados pessoais necessários para a prestação do serviço da plataforma{' '}
          <strong>D.job System</strong>. Os dados coletados podem incluir:
        </p>

        <h3>Dados fornecidos pelo usuário</h3>
        <ul>
          <li>Nome completo, e-mail corporativo e cargo</li>
          <li>Telefone de contato</li>
          <li>Dados da organização (razão social, CNPJ, endereço)</li>
          <li>Credenciais de acesso (e-mail e senha criptografada)</li>
        </ul>

        <h3>Dados coletados automaticamente</h3>
        <ul>
          <li>Endereço IP e informações do navegador (User-Agent)</li>
          <li>Dados de uso e navegação na Plataforma (páginas acessadas, ações realizadas)</li>
          <li>Data e hora de acesso</li>
          <li>Dados de dispositivo (sistema operacional, resolução de tela)</li>
        </ul>
      </section>

      <section id="finalidade">
        <h2>2. Finalidade do Tratamento</h2>
        <p>Os dados pessoais são tratados para as seguintes finalidades:</p>
        <ul>
          <li>Criação e gerenciamento de contas de usuário</li>
          <li>Autenticação e controle de acesso à Plataforma</li>
          <li>Prestação e melhoria dos serviços contratados</li>
          <li>Comunicação sobre atualizações, manutenções e novidades do serviço</li>
          <li>Suporte técnico e atendimento ao cliente</li>
          <li>Cumprimento de obrigações legais e regulatórias</li>
          <li>Análise de uso para melhoria contínua da experiência do usuário</li>
          <li>Prevenção de fraudes e segurança da informação</li>
        </ul>
      </section>

      <section id="base-legal">
        <h2>3. Base Legal (LGPD)</h2>
        <p>
          O tratamento de dados pessoais pela D.job é realizado com fundamento nas seguintes bases
          legais previstas na Lei Geral de Proteção de Dados (Lei nº 13.709/2018):
        </p>
        <ul>
          <li>
            <strong>Execução de contrato:</strong> o tratamento é necessário para a prestação do
            serviço contratado (Art. 7º, V)
          </li>
          <li>
            <strong>Legítimo interesse:</strong> para melhoria dos serviços, análise de uso e
            prevenção de fraudes (Art. 7º, IX)
          </li>
          <li>
            <strong>Cumprimento de obrigação legal:</strong> quando exigido por legislação ou
            determinação de autoridade competente (Art. 7º, II)
          </li>
          <li>
            <strong>Consentimento:</strong> quando aplicável, para finalidades específicas como envio
            de comunicações de marketing (Art. 7º, I)
          </li>
        </ul>
      </section>

      <section id="compartilhamento">
        <h2>4. Compartilhamento de Dados</h2>
        <p>
          A D.job não comercializa dados pessoais. O compartilhamento ocorre apenas nas seguintes
          situações:
        </p>
        <ul>
          <li>
            <strong>Provedores de infraestrutura:</strong> serviços de hospedagem, banco de dados e
            armazenamento em nuvem, estritamente para a operação da Plataforma
          </li>
          <li>
            <strong>Ferramentas de análise:</strong> serviços de monitoramento e análise de
            desempenho, com dados anonimizados quando possível
          </li>
          <li>
            <strong>Obrigação legal:</strong> quando exigido por lei, regulação ou ordem judicial
          </li>
          <li>
            <strong>Proteção de direitos:</strong> para defender os direitos, a propriedade ou a
            segurança da D.job, de seus usuários ou do público
          </li>
        </ul>
        <p>
          Todos os terceiros com acesso a dados pessoais são contratualmente obrigados a cumprir
          padrões adequados de segurança e privacidade.
        </p>
      </section>

      <section id="armazenamento">
        <h2>5. Armazenamento e Segurança</h2>
        <p>
          Os dados pessoais são armazenados em servidores seguros, com as seguintes medidas de
          proteção:
        </p>
        <ul>
          <li>Criptografia de dados em trânsito (TLS/HTTPS) e em repouso</li>
          <li>Senhas armazenadas com hash criptográfico unidirecional (bcrypt)</li>
          <li>Controle de acesso baseado em função (RBAC)</li>
          <li>Isolamento de dados por organização (multi-tenancy com Row Level Security)</li>
          <li>Backups regulares com política de retenção definida</li>
          <li>Monitoramento contínuo de acessos e anomalias</li>
        </ul>
        <p>
          Os dados são retidos pelo período necessário ao cumprimento das finalidades descritas nesta
          Política ou conforme exigido por legislação aplicável. Após o encerramento da conta, os
          dados serão eliminados em até 90 (noventa) dias, salvo obrigação legal de retenção.
        </p>
      </section>

      <section id="direitos">
        <h2>6. Direitos do Titular</h2>
        <p>
          Em conformidade com a LGPD, você tem o direito de, a qualquer momento, solicitar:
        </p>
        <ul>
          <li>
            <strong>Confirmação e acesso:</strong> saber se tratamos seus dados e acessar uma cópia
          </li>
          <li>
            <strong>Correção:</strong> solicitar a atualização de dados incompletos, inexatos ou
            desatualizados
          </li>
          <li>
            <strong>Anonimização ou eliminação:</strong> de dados desnecessários ou tratados em
            desconformidade com a LGPD
          </li>
          <li>
            <strong>Portabilidade:</strong> solicitar a transferência de seus dados a outro
            fornecedor
          </li>
          <li>
            <strong>Revogação do consentimento:</strong> quando o tratamento for baseado em
            consentimento
          </li>
          <li>
            <strong>Oposição:</strong> ao tratamento realizado com base em legítimo interesse, caso
            discorde
          </li>
          <li>
            <strong>Informação sobre compartilhamento:</strong> saber com quais entidades seus dados
            foram compartilhados
          </li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato por meio dos canais indicados na seção
          &quot;Contato e Encarregado&quot; abaixo. Responderemos em até 15 (quinze) dias úteis.
        </p>
      </section>

      <section id="cookies">
        <h2>7. Cookies e Tecnologias</h2>
        <p>
          A Plataforma utiliza cookies e tecnologias similares para os seguintes fins:
        </p>
        <ul>
          <li>
            <strong>Cookies essenciais:</strong> necessários para o funcionamento da Plataforma
            (autenticação, preferências de sessão)
          </li>
          <li>
            <strong>Cookies de desempenho:</strong> para análise de uso e melhoria da experiência
            (anonimizados)
          </li>
        </ul>
        <p>
          Não utilizamos cookies de publicidade ou rastreamento de terceiros. Você pode gerenciar as
          preferências de cookies nas configurações do seu navegador, mas a desativação de cookies
          essenciais pode impactar o funcionamento da Plataforma.
        </p>
      </section>

      <section id="contato">
        <h2>8. Contato e Encarregado (DPO)</h2>
        <p>
          Para dúvidas, solicitações ou reclamações relacionadas ao tratamento de dados pessoais,
          entre em contato com o nosso Encarregado de Proteção de Dados (DPO):
        </p>
        <ul>
          <li>
            <strong>E-mail:</strong> privacidade@djob.com.br
          </li>
          <li>
            <strong>Endereço:</strong> D.job Sistemas Ltda. — São Paulo/SP, Brasil
          </li>
        </ul>
        <p>
          Caso não fique satisfeito com a resposta, você tem o direito de registrar uma reclamação
          junto à Autoridade Nacional de Proteção de Dados (ANPD).
        </p>
      </section>
    </LegalShell>
  );
}
