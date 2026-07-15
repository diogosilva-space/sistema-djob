'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Bell,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Menu,
  Moon,
  PanelLeft,
  Settings,
  Sun,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onMobileMenuToggle: () => void;
}

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/crm': 'CRM (Clientes)',
  '/crm/new': 'Novo Cliente',
  '/products': 'Produtos',
  '/vendas/orcamentos': 'Orçamentos',
  '/vendas/pedidos': 'Pedidos de Venda',
  '/pcp': 'Produção (PCP)',
  '/estoque': 'Estoque (Saldo)',
  '/estoque/movimentacoes': 'Movimentações',
  '/compras': 'Pedidos de Compra',
  '/rh': 'Recursos Humanos',
  '/rh/novo': 'Novo Colaborador',
  '/logistica': 'Logística & Entregas',
  '/financeiro': 'Financeiro',
};

function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; path: string }[] = [];

  let accumulated = '';
  for (const segment of segments) {
    accumulated += `/${segment}`;
    const label = routeLabels[accumulated] || decodeURIComponent(segment);
    crumbs.push({ label, path: accumulated });
  }

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.path} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          <span
            className={
              idx === crumbs.length - 1
                ? 'font-medium text-foreground'
                : 'text-muted-foreground'
            }
          >
            {crumb.label}
          </span>
        </span>
      ))}
    </nav>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Alternar tema"
      className="text-muted-foreground"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export function Header({ collapsed, onToggleSidebar, onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[50px] shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-5">
      {/* Left: toggle + breadcrumb */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex text-muted-foreground"
          onClick={onToggleSidebar}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground"
          onClick={onMobileMenuToggle}
          aria-label="Abrir menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="hidden h-5 md:block" />
        <Breadcrumb />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative text-muted-foreground" aria-label="Notificações">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-secondary" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-2 ml-1">
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">A</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium leading-tight">Admin</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Demo Confecção A</p>
              </div>
              <ChevronsUpDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">admin@djob.com.br</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-3.5 w-3.5" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-3.5 w-3.5" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
