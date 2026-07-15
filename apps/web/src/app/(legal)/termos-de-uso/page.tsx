import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'Termos de Uso da plataforma D.job System — ERP/CRM industrial multitenant.',
};

const SECTIONS = [
  { id: 'aceitacao', title: 'Aceitação dos Termos' },
  { id: 'descricao', title: 'Descrição do Serviço' },
  { id: 'cadastro', title: 'Cadastro e Conta' },
  { id: 'uso-permitido', title: 'Uso Permitido' },
  { id: 'propriedade', title: 'Propriedade Intelectual' },
  { id: 'limitacao', title: 'Limitação de Responsabilidade' },
  { id: 'modificacoes', title: 'Modificações dos Termos' },
  { id: 'foro', title: 'Foro e Legislação Aplicável' },
];

export default function TermosDeUsoPage() {
  return (
    <LegalShell title="Termos de Uso" lastUpdated="Julho de 2026" sections={SECTIONS}>
      <section id="aceitacao">
        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao acessar ou utilizar a plataforma <strong>D.job System</strong> (&quot;Plataforma&quot;),
          operada por <strong>D.job Sistemas Ltda.</strong> (&quot;D.job&quot;, &quot;nós&quot; ou
          &quot;nosso&quot;), você declara que leu, compreendeu e concorda integralmente com estes
          Termos de Uso (&quot;Termos&quot;).
        </p>
        <p>
          Caso não concorde com qualquer disposição destes Termos, você deverá interromper
          imediatamente o uso da Plataforma. O uso continuado constitui aceitação tácita de eventuais
          atualizações.
        </p>
      </section>

      <section id="descricao">
        <h2>2. Descrição do Serviço</h2>
        <p>
          A Plataforma D.job System é um sistema de gestão empresarial (ERP) com CRM integrado,
          projetado para indústrias de confecção e manufatura. Os módulos disponíveis incluem, mas
          não se limitam a:
        </p>
        <ul>
          <li>Gestão de clientes e oportunidades comerciais (CRM)</li>
          <li>Planejamento e controle de produção (PCP)</li>
          <li>Controle de estoque e movimentações</li>
          <li>Gestão financeira (contas a pagar e receber)</li>
          <li>Gestão de compras e pedidos de venda</li>
          <li>Logística e expedição</li>
          <li>Gestão de recursos humanos</li>
        </ul>
        <p>
          A D.job reserva-se o direito de adicionar, modificar ou descontinuar funcionalidades a
          qualquer momento, mediante aviso prévio aos usuários ativos.
        </p>
      </section>

      <section id="cadastro">
        <h2>3. Cadastro e Conta</h2>
        <p>
          Para utilizar a Plataforma, é necessário possuir uma conta ativa. O cadastro é realizado
          pelo administrador da organização contratante, que é responsável por:
        </p>
        <ul>
          <li>Fornecer informações verdadeiras, completas e atualizadas</li>
          <li>Manter a confidencialidade de suas credenciais de acesso</li>
          <li>Notificar a D.job imediatamente em caso de uso não autorizado</li>
          <li>Garantir que todos os usuários de sua organização cumpram estes Termos</li>
        </ul>
        <p>
          Cada conta é pessoal e intransferível. A D.job poderá suspender ou encerrar contas que
          violem estes Termos, sem necessidade de aviso prévio.
        </p>
      </section>

      <section id="uso-permitido">
        <h2>4. Uso Permitido</h2>
        <p>Ao utilizar a Plataforma, você se compromete a:</p>
        <ul>
          <li>Utilizar o serviço apenas para fins empresariais legítimos</li>
          <li>Não tentar acessar áreas restritas ou dados de outros clientes</li>
          <li>
            Não realizar engenharia reversa, descompilar ou desmontar qualquer parte da Plataforma
          </li>
          <li>Não utilizar automações, bots ou scripts não autorizados</li>
          <li>Não transmitir conteúdo ilícito, difamatório ou que viole direitos de terceiros</li>
          <li>Cumprir toda a legislação aplicável, incluindo a LGPD</li>
        </ul>
      </section>

      <section id="propriedade">
        <h2>5. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo da Plataforma — incluindo, mas não se limitando a, código-fonte, design,
          logotipos, textos, gráficos e interfaces — é de propriedade exclusiva da D.job Sistemas ou
          de seus licenciadores, sendo protegido pelas leis brasileiras de propriedade intelectual.
        </p>
        <p>
          A contratação do serviço confere ao cliente uma licença limitada, não exclusiva,
          intransferível e revogável para uso da Plataforma durante a vigência do contrato. Nenhum
          direito de propriedade é transferido.
        </p>
      </section>

      <section id="limitacao">
        <h2>6. Limitação de Responsabilidade</h2>
        <p>
          A Plataforma é fornecida &quot;como está&quot; (<em>as is</em>). A D.job emprega esforços
          razoáveis para manter a disponibilidade e a integridade do serviço, mas não garante:
        </p>
        <ul>
          <li>Funcionamento ininterrupto ou livre de erros</li>
          <li>
            Que os resultados obtidos serão precisos ou confiáveis para todas as finalidades
          </li>
          <li>Compatibilidade com todos os dispositivos ou navegadores</li>
        </ul>
        <p>
          A D.job não será responsável por danos indiretos, incidentais, consequenciais ou punitivos
          decorrentes do uso ou da impossibilidade de uso da Plataforma, incluindo, mas não se
          limitando a, perda de dados, lucros cessantes ou interrupção de negócios.
        </p>
      </section>

      <section id="modificacoes">
        <h2>7. Modificações dos Termos</h2>
        <p>
          A D.job poderá modificar estes Termos a qualquer momento. As alterações entrarão em vigor
          na data de sua publicação na Plataforma. Recomendamos que os usuários revisem
          periodicamente esta página.
        </p>
        <p>
          Alterações substanciais serão comunicadas por e-mail ou por meio de aviso destacado na
          Plataforma com, no mínimo, 15 (quinze) dias de antecedência. O uso continuado após a
          vigência das alterações constitui aceitação dos novos Termos.
        </p>
      </section>

      <section id="foro">
        <h2>8. Foro e Legislação Aplicável</h2>
        <p>
          Estes Termos são regidos pela legislação da República Federativa do Brasil. Fica eleito o
          foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes destes
          Termos, com renúncia a qualquer outro, por mais privilegiado que seja.
        </p>
        <p>
          Em caso de dúvidas sobre estes Termos, entre em contato pelo e-mail:{' '}
          <strong>contato@djob.com.br</strong>.
        </p>
      </section>
    </LegalShell>
  );
}
