import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout';
import { routes } from '@/routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
