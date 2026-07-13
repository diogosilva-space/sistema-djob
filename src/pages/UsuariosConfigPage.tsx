import React, { useState } from 'react';
import { ChevronLeft, UserPlus, Shield, MoreVertical, Mail, UserCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil:
    'Administrador' | 'Gerente Comercial' | 'Vendedor' | 'Produção' | 'Financeiro' | 'Compras';
  status: 'Ativo' | 'Inativo';
  ultimoAcesso: string;
}

const usuariosMock: Usuario[] = [
  {
    id: '1',
    nome: 'Rogério Silva',
    email: 'rogerio@djob.com.br',
    perfil: 'Administrador',
    status: 'Ativo',
    ultimoAcesso: 'Hoje, 09:15',
  },
  {
    id: '2',
    nome: 'Amanda Oliveira',
    email: 'amanda@djob.com.br',
    perfil: 'Gerente Comercial',
    status: 'Ativo',
    ultimoAcesso: 'Hoje, 08:30',
  },
  {
    id: '3',
    nome: 'Bruno Costa',
    email: 'bruno@djob.com.br',
    perfil: 'Vendedor',
    status: 'Ativo',
    ultimoAcesso: 'Ontem, 17:45',
  },
  {
    id: '4',
    nome: 'Cláudia Santos',
    email: 'claudia@djob.com.br',
    perfil: 'Produção',
    status: 'Ativo',
    ultimoAcesso: 'Hoje, 07:00',
  },
  {
    id: '5',
    nome: 'Daniel Ferreira',
    email: 'daniel@djob.com.br',
    perfil: 'Financeiro',
    status: 'Ativo',
    ultimoAcesso: 'Hoje, 10:20',
  },
  {
    id: '6',
    nome: 'Eduardo Lima',
    email: 'eduardo@djob.com.br',
    perfil: 'Compras',
    status: 'Inativo',
    ultimoAcesso: 'Há 15 dias',
  },
];

export const UsuariosConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case 'Administrador':
        return 'bg-category-1/10 text-category-1 border-category-1/20';
      case 'Gerente Comercial':
        return 'bg-category-5/10 text-category-5 border-category-5/20';
      case 'Vendedor':
        return 'bg-success/10 text-success border-success/20';
      case 'Produção':
        return 'bg-category-3/10 text-category-3 border-category-3/20';
      case 'Financeiro':
        return 'bg-category-4/10 text-category-4 border-category-4/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate('/configuracoes')}
          >
            <ChevronLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Usuários e Permissões</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie os usuários do sistema e seus níveis de acesso
            </p>
          </div>
        </div>
        <Button className="gap-2 h-10">
          <UserPlus size={18} />
          Novo Usuário
        </Button>
      </div>

      <Card className="shadow-sm border-muted/40 font-inter">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-9 h-9 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-2 text-xs">
              <Shield size={14} />
              Gerenciar Perfis
            </Button>
          </div>

          <div className="rounded-md border border-muted/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Usuário</TableHead>
                  <TableHead className="text-xs font-semibold">Perfil de Acesso</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Último Acesso</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosMock.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/20 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold border border-primary/20">
                          {u.nome
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold leading-none mb-1">{u.nome}</span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Mail size={10} /> {u.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full border inline-block ${getPerfilColor(u.perfil)}`}
                      >
                        {u.perfil}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={u.status === 'Ativo' ? 'default' : 'outline'}
                        className="h-5 text-[10px] uppercase font-bold"
                      >
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-[12px] text-muted-foreground">
                      {u.ultimoAcesso}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem className="cursor-pointer gap-2">
                            <UserCheck size={14} /> Editar Usuário
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2">
                            <Shield size={14} /> Alterar Permissões
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2 text-destructive">
                            Inativar Acesso
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
