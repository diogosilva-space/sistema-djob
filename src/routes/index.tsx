import { RouteObject } from 'react-router-dom';

import { DashboardPage } from '@/pages/DashboardPage';
import { CRMPage } from '@/pages/CRMPage';
import { ClienteNovoPage } from '@/pages/ClienteNovoPage';
import { ClienteDetalhesPage } from '@/pages/ClienteDetalhesPage';
import { ClienteEditarPage } from '@/pages/ClienteEditarPage';
import { VendasPage } from '@/pages/VendasPage';
import { OrcamentoNovoPage } from '@/pages/OrcamentoNovoPage';
import { ProdutosPage } from '@/pages/ProdutosPage';
import { ProdutoNovoPage } from '@/pages/ProdutoNovoPage';
import { ProdutoDetalhesPage } from '@/pages/ProdutoDetalhesPage';
import { EstoquePage } from '@/pages/EstoquePage';
import { ComprasPage } from '@/pages/ComprasPage';
import { ProducaoPage } from '@/pages/ProducaoPage';
import { OrdemProducaoDetalhesPage } from '@/pages/OrdemProducaoDetalhesPage';
import { FinanceiroPage } from '@/pages/FinanceiroPage';
import { RHPage } from '@/pages/RHPage';
import { FuncionarioNovoPage } from '@/pages/FuncionarioNovoPage';
import { LogisticaPage } from '@/pages/LogisticaPage';
import { ProtocoloNovoPage } from '@/pages/ProtocoloNovoPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { ConfiguracoesPage } from '@/pages/ConfiguracoesPage';
import { UsuariosConfigPage } from '@/pages/UsuariosConfigPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/crm',
    element: <CRMPage />,
  },
  {
    path: '/crm/clientes/novo',
    element: <ClienteNovoPage />,
  },
  {
    path: '/crm/clientes/:id',
    element: <ClienteDetalhesPage />,
  },
  {
    path: '/crm/clientes/:id/editar',
    element: <ClienteEditarPage />,
  },
  {
    path: '/vendas',
    element: <VendasPage />,
  },
  {
    path: '/vendas/orcamentos/novo',
    element: <OrcamentoNovoPage />,
  },
  {
    path: '/produtos',
    element: <ProdutosPage />,
  },
  {
    path: '/produtos/novo',
    element: <ProdutoNovoPage />,
  },
  {
    path: '/produtos/:id',
    element: <ProdutoDetalhesPage />,
  },
  {
    path: '/estoque',
    element: <EstoquePage />,
  },
  {
    path: '/compras',
    element: <ComprasPage />,
  },
  {
    path: '/producao',
    element: <ProducaoPage />,
  },
  {
    path: '/producao/ordem/:id',
    element: <OrdemProducaoDetalhesPage />,
  },
  {
    path: '/financeiro',
    element: <FinanceiroPage />,
  },
  {
    path: '/rh',
    element: <RHPage />,
  },
  {
    path: '/rh/funcionarios/novo',
    element: <FuncionarioNovoPage />,
  },
  {
    path: '/logistica',
    element: <LogisticaPage />,
  },
  {
    path: '/logistica/protocolos/novo',
    element: <ProtocoloNovoPage />,
  },
  {
    path: '/relatorios',
    element: <ReportsPage />,
  },
  {
    path: '/configuracoes',
    element: <ConfiguracoesPage />,
  },
  {
    path: '/configuracoes/usuarios',
    element: <UsuariosConfigPage />,
  },
];
