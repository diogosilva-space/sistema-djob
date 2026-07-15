'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Target,
  ShoppingCart,
  Cpu,
  Database,
  History,
  ShoppingBag,
  UserCheck,
  Truck,
  DollarSign,
  Building2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface SidebarProps {
  collapsed: boolean;
}

const operationalSections = [
  {
    label: 'Principal',
    items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Comercial',
    items: [
      { href: '/contacts', label: 'Contatos', icon: Users },
      { href: '/crm', label: 'Pipeline', icon: Target },
      { href: '/vendas/orcamentos', label: 'Orçamentos', icon: FileText },
      { href: '/vendas/pedidos', label: 'Pedidos de Venda', icon: ShoppingCart },
    ],
  },
  {
    label: 'Produção & Estoque',
    items: [
      { href: '/products', label: 'Produtos', icon: Package },
      { href: '/pcp', label: 'Produção (PCP)', icon: Cpu },
      { href: '/estoque', label: 'Estoque (Saldo)', icon: Database },
      { href: '/estoque/movimentacoes', label: 'Movimentações', icon: History },
    ],
  },
  {
    label: 'Administrativo',
    items: [
      { href: '/compras', label: 'Compras', icon: ShoppingBag },
      { href: '/rh', label: 'Recursos Humanos', icon: UserCheck },
      { href: '/logistica', label: 'Logística', icon: Truck },
      { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
    ],
  },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuth((state) => state.user);
  const navSections =
    user?.role === 'SUPER_ADMIN'
      ? [
          {
            label: 'Administração',
            items: [{ href: '/admin/tenants', label: 'Empresas', icon: Building2 }],
          },
        ]
      : operationalSections;

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border bg-card transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-[3.25rem]' : 'w-60',
      )}
    >
      {/* Branding */}
      <div
        className={cn(
          'flex h-[50px] shrink-0 items-center border-b border-border',
          collapsed ? 'justify-center px-2' : 'gap-2.5 px-4',
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">D</span>
        </div>
        {!collapsed && (
          <span className="text-[14px] font-semibold tracking-tight text-foreground">
            Djob<span className="text-primary">System</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <div className="flex flex-col gap-3">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/75">
                  {section.label}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-2.5 overflow-hidden rounded-lg text-xs font-normal transition-colors duration-150',
                        collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2',
                        isActive
                          ? 'bg-primary/10 font-semibold text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
