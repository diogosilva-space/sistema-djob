import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Package,
  Warehouse,
  ShoppingCart,
  Factory,
  DollarSign,
  UserCog,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ── Tipos ──
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// ── Configuração de Navegação (12 módulos, 4 grupos) ──
const navGroups: NavGroup[] = [
  {
    title: 'Comercial',
    items: [
      { icon: Users, label: 'CRM', href: '/crm' },
      { icon: TrendingUp, label: 'Vendas', href: '/vendas' },
      { icon: Package, label: 'Produtos', href: '/produtos' },
    ],
  },
  {
    title: 'Operacional',
    items: [
      { icon: Warehouse, label: 'Estoque', href: '/estoque' },
      { icon: ShoppingCart, label: 'Compras', href: '/compras' },
      { icon: Factory, label: 'Produção', href: '/producao' },
    ],
  },
  {
    title: 'Administrativo',
    items: [
      { icon: DollarSign, label: 'Financeiro', href: '/financeiro' },
      { icon: UserCog, label: 'RH', href: '/rh' },
      { icon: Truck, label: 'Logística', href: '/logistica' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { icon: BarChart3, label: 'Relatórios', href: '/relatorios' },
      { icon: Settings, label: 'Configurações', href: '/configuracoes' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out lg:static',
          // Desktop: collapsed vs expanded
          isCollapsed ? 'lg:w-[var(--sidebar-collapsed-width)]' : 'lg:w-[var(--sidebar-width)]',
          // Mobile: slide in/out
          isOpen ? 'w-[var(--sidebar-width)] translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* ── Header da Sidebar ── */}
        <div
          className={cn(
            'flex h-14 shrink-0 items-center border-b border-sidebar-border px-4',
            isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between',
          )}
        >
          <div className={cn('flex items-center gap-2.5', isCollapsed && 'lg:hidden')}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">D</span>
            </div>
            <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
              Djob<span className="text-sidebar-primary">System</span>
            </span>
          </div>

          {/* Logo mini (quando colapsado, apenas desktop) */}
          <div className={cn('hidden items-center justify-center', isCollapsed && 'lg:flex')}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">D</span>
            </div>
          </div>

          {/* Botão fechar (mobile) */}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Navegação ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {/* Dashboard — sempre visível, fora dos grupos */}
          <div className="mb-2">
            <NavItem
              item={{ icon: LayoutDashboard, label: 'Dashboard', href: '/' }}
              isCollapsed={isCollapsed}
              onClose={onClose}
              isExactMatch
            />
          </div>

          {/* Grupos de navegação */}
          {navGroups.map((group) => {
            return (
              <div key={group.title} className="mb-1">
                {/* Título do grupo (oculto quando sidebar colapsada) */}
                {!isCollapsed && (
                  <div className="flex w-full items-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
                    <span>{group.title}</span>
                  </div>
                )}

                {/* Separador visual quando colapsado */}
                {isCollapsed && (
                  <div className="mx-auto my-2 hidden w-6 border-t border-sidebar-border lg:block" />
                )}

                {/* Items do grupo */}
                <div className="flex flex-col space-y-0.5">
                  {group.items.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      isCollapsed={isCollapsed}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── Footer da Sidebar ── */}
        <div className="shrink-0 border-t border-sidebar-border p-3">
          {/* Botão de sair */}
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10',
                    'lg:justify-center lg:px-0',
                  )}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="lg:hidden">Sair da Conta</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-popover text-popover-foreground border-border shadow-md"
              >
                Sair da Conta
              </TooltipContent>
            </Tooltip>
          ) : (
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10">
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sair da Conta</span>
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};

// ── Componente de Item de Navegação ──
interface NavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  onClose: () => void;
  isExactMatch?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, isCollapsed, onClose, isExactMatch }) => {
  const navLink = (
    <NavLink
      to={item.href}
      end={isExactMatch}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-150',
          isActive
            ? 'bg-sidebar-accent text-sidebar-primary'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
          isCollapsed && 'lg:justify-center lg:px-0',
        )
      }
      onClick={() => {
        if (window.innerWidth < 1024) onClose();
      }}
    >
      {({ isActive }) => (
        <>
          {/* Indicador de ativo — faixa lateral */}
          <span
            className={cn(
              'absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-all duration-200',
              isActive ? 'bg-sidebar-primary opacity-100' : 'opacity-0',
            )}
            aria-hidden
          />

          <item.icon className={cn('h-4 w-4 shrink-0', isCollapsed && 'ml-1')} />
          <span className={cn('truncate', isCollapsed && 'lg:hidden')}>{item.label}</span>
        </>
      )}
    </NavLink>
  );

  if (!isCollapsed) {
    return navLink;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{navLink}</TooltipTrigger>
      <TooltipContent
        side="right"
        className="bg-popover text-popover-foreground border-border shadow-md"
      >
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
};
