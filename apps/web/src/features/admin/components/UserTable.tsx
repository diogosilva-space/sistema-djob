'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { AdminUser } from '../api/admin.api';

interface UserTableProps {
  users: AdminUser[];
  isToggling: boolean;
  onToggle: (user: AdminUser) => void;
}

const roleLabels: Record<AdminUser['role'], string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  SELLER: 'Vendedor',
  OPERATOR: 'Operador',
  VIEWER: 'Visualizador',
  SUPER_ADMIN: 'Super Admin',
};

export function UserTable({ users, isToggling, onToggle }: UserTableProps) {
  if (!users.length) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Nenhum usuário encontrado.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead className="hidden md:table-cell">Último acesso</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </TableCell>
            <TableCell>{roleLabels[user.role]}</TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {user.lastLoginAt
                ? new Intl.DateTimeFormat('pt-BR').format(new Date(user.lastLoginAt))
                : 'Nunca'}
            </TableCell>
            <TableCell>
              <StatusBadge status={user.isActive ? 'success' : 'neutral'}>
                {user.isActive ? 'Ativo' : 'Inativo'}
              </StatusBadge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                disabled={isToggling || user.role === 'SUPER_ADMIN'}
                onClick={() => onToggle(user)}
              >
                {isToggling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : user.isActive ? (
                  'Desativar'
                ) : (
                  'Ativar'
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
