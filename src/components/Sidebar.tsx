import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    ChevronRight,
    TrendingUp,
    Settings,
    HelpCircle,
    LogOut,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists, it's common in shadcn/ui setups

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: ShoppingCart, label: 'Compras', href: '/compras' },
    { icon: Package, label: 'Estoque', href: '/estoque' },
    { icon: TrendingUp, label: 'Financeiro', href: '/financeiro' },
];

const secondaryItems = [
    { icon: Settings, label: 'Configurações', href: '/configuracoes' },
    { icon: HelpCircle, label: 'Ajuda', href: '/ajuda' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-30 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                        <span className="text-xl font-bold text-secondary-foreground">D</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-sidebar-foreground">
                        Djob<span className="text-primary">System</span>
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto h-[calc(100vh-128px)]">
                <div className="mb-4">
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                        Principal
                    </p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )
                            }
                            onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.label}</span>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </NavLink>
                    ))}
                </div>

                <div>
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                        Sistema
                    </p>
                    {secondaryItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                                )
                            }
                            onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                            }}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-sidebar-border bg-sidebar">
                <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span>Sair da Conta</span>
                </button>
            </div>
        </aside>
    );
};
