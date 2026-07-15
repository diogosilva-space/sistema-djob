'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ShoppingCart,
  Cpu,
  Database,
  History,
  ShoppingBag,
  UserCheck,
  Truck,
  DollarSign,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/crm', label: 'CRM (Clientes)', icon: Users },
    { href: '/products', label: 'Produtos', icon: Package },
    { href: '/vendas/orcamentos', label: 'Orçamentos', icon: FileText },
    { href: '/vendas/pedidos', label: 'Pedidos de Venda', icon: ShoppingCart },
    { href: '/pcp', label: 'Produção (PCP)', icon: Cpu },
    { href: '/estoque', label: 'Estoque (Saldo)', icon: Database },
    { href: '/estoque/movimentacoes', label: 'Movimentações', icon: History },
    { href: '/compras', label: 'Pedidos de Compra', icon: ShoppingBag },
    { href: '/rh', label: 'Recursos Humanos', icon: UserCheck },
    { href: '/logistica', label: 'Logística & Entregas', icon: Truck },
    { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50/50 flex flex-col min-h-screen">
      <div className="h-14 border-b border-slate-200 flex items-center px-6 font-bold text-slate-900 tracking-tight text-lg">
        D.job System
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
