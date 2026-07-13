import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, User, Search, ChevronRight, PanelLeft } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

// ── Mapeamento de rotas para breadcrumbs ──
const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  crm: 'CRM',
  vendas: 'Vendas',
  produtos: 'Produtos',
  estoque: 'Estoque',
  compras: 'Compras',
  producao: 'Produção',
  financeiro: 'Financeiro',
  rh: 'Recursos Humanos',
  logistica: 'Logística',
  relatorios: 'Relatórios',
  configuracoes: 'Configurações',
  clientes: 'Clientes',
  novo: 'Novo',
  editar: 'Editar',
  orcamentos: 'Orçamentos',
  ordem: 'Ordem',
  funcionarios: 'Funcionários',
  protocolos: 'Protocolos',
  usuarios: 'Usuários',
};

// ── Saudação baseada na hora ──
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onToggleCollapse, isCollapsed }) => {
  const location = useLocation();

  // Gerar breadcrumbs a partir da rota atual
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    // Ignorar IDs numéricos ou UUIDs
    const isId = /^[0-9a-f-]+$/i.test(segment) && segment.length > 2;
    const label = isId ? 'Detalhes' : routeLabels[segment] || segment;
    return { label, path: '/' + pathSegments.slice(0, index + 1).join('/') };
  });

  const pageTitle =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Dashboard';

  return (
    <header className="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 md:px-5">
      {/* ── Lado Esquerdo: Menu + Breadcrumbs ── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Botão hamburger (mobile) */}
        <button
          onClick={onMenuClick}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Botão recolher menu (desktop) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:inline-flex"
            aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {/* Breadcrumbs (desktop) */}
        <nav className="hidden items-center gap-1 text-sm lg:flex" aria-label="Breadcrumbs">
          <span className="font-medium text-foreground">{pageTitle}</span>
          {breadcrumbs.length > 1 && (
            <div className="ml-2 flex items-center gap-1 text-muted-foreground">
              {breadcrumbs.slice(0, -1).map((crumb, idx) => (
                <React.Fragment key={crumb.path}>
                  {idx > 0 && <ChevronRight className="h-3 w-3" />}
                  <span className="text-xs">{crumb.label}</span>
                </React.Fragment>
              ))}
              <ChevronRight className="h-3 w-3" />
              <span className="text-xs font-medium text-foreground">
                {breadcrumbs[breadcrumbs.length - 1].label}
              </span>
            </div>
          )}
        </nav>

        {/* Título da página (mobile) */}
        <span className="truncate text-sm font-medium text-foreground lg:hidden">{pageTitle}</span>
      </div>

      {/* ── Lado Direito: Search + Actions ── */}
      <div className="flex items-center gap-1.5 md:gap-2.5">
        {/* Busca global */}
        <div className="relative hidden md:flex">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Pesquisar..."
            className="h-8 w-48 rounded-lg border border-input bg-accent/30 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:w-64 focus:bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:w-56 lg:focus:w-72"
          />
        </div>

        {/* Toggle de tema */}
        <ThemeToggle />

        {/* Notificações */}
        <button
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary ring-2 ring-card" />
        </button>

        {/* Separador */}
        <div className="hidden h-6 w-px bg-border sm:block" />

        {/* Perfil do usuário */}
        <button className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-accent">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden flex-col items-start sm:flex">
            <span className="text-xs font-medium leading-none text-foreground">
              {getGreeting()}, Usuário
            </span>
            <span className="mt-0.5 text-[10px] text-muted-foreground">Administrador</span>
          </div>
        </button>
      </div>
    </header>
  );
};
