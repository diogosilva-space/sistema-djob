import React, { useState } from 'react';

import { Sidebar } from './Sidebar';
import { Header } from './Header';

// Definição de Tipos (Props)
interface AppLayoutProps {
  children: React.ReactNode;
}

// Componente Funcional
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // Hooks - Estado para controlar o menu mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Funções de Manipulação de Eventos
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Retorno JSX
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-accent/20 p-4 md:p-6 transition-colors duration-300">
          <div className="mx-auto max-w-screen-2xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
