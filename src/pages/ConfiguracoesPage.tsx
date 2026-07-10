import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, Building2, Mail, FileText, Settings } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const sections = [
  { icon: <Users className="size-5 text-muted-foreground" />, title: 'Usuários', description: 'Gerenciar usuários e acessos', path: '/configuracoes/usuarios' },
  { icon: <Lock className="size-5 text-muted-foreground" />, title: 'Permissões', description: 'Perfis de acesso do sistema', path: '/configuracoes/usuarios' },
  { icon: <Building2 className="size-5 text-muted-foreground" />, title: 'Empresa', description: 'Dados da empresa', path: '#' },
  { icon: <Mail className="size-5 text-muted-foreground" />, title: 'E-mail', description: 'Configurações de e-mail', path: '#' },
  { icon: <FileText className="size-5 text-muted-foreground" />, title: 'Templates', description: 'Orçamentos e documentos', path: '#' },
  { icon: <Settings className="size-5 text-muted-foreground" />, title: 'Parâmetros', description: 'Configurações gerais', path: '#' },
];

export const ConfiguracoesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <header className="space-y-0.5">
        <h1 className="text-lg font-semibold">Configurações</h1>
        <p className="text-xs text-muted-foreground">
          Gerencie usuários, permissões e parâmetros do sistema
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ icon, title, description, path }) => (
          <Card
            key={title}
            className="cursor-pointer transition-colors hover:bg-accent"
            onClick={() => path !== '#' && navigate(path)}
          >
            <CardHeader className="space-y-2">
              <div className="flex items-start gap-3">
                {icon}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <CardTitle className="text-xs font-medium">{title}</CardTitle>
                  <CardDescription className="text-[11px]">{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
