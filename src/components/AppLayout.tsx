import React, { useState, useEffect } from 'react';

import { Sidebar } from './Sidebar';
import { Header } from './Header';

// Definição de Tipos (Props)
interface AppLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_COLLAPSED_KEY = 'djob-sidebar-collapsed';

// Componente Funcional
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // Hooks - Estado para controlar o menu mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Estado: sidebar colapsada (desktop)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
  }, [isCollapsed]);

  // Funções de Manipulação de Eventos
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Retorno JSX
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} isCollapsed={isCollapsed} />

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[2px] transition-opacity lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Área de conteúdo principal */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={toggleSidebar}
          onToggleCollapse={toggleCollapse}
          isCollapsed={isCollapsed}
        />

        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-5 lg:p-6">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
};
