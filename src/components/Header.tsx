import React from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-card px-4 shadow-sm md:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
                    aria-label="Abrir menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="relative hidden max-w-md flex-1 md:flex">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Pesquisar..."
                        className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-96"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <ThemeToggle />

                <button
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label="Notificações"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
                </button>

                <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

                <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent md:gap-3 md:pr-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="hidden flex-col items-start text-sm sm:flex">
                        <span className="font-medium leading-none">Usuário Djob</span>
                        <span className="text-xs text-muted-foreground">Administrador</span>
                    </div>
                </button>
            </div>
        </header>
    );
};
