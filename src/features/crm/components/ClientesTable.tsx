import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Cliente } from '../types/Cliente.types';
import { useClientes, useDeleteCliente } from '../hooks/useClientes';

// Definição de Tipos (Props)
interface ClientesTableProps {
  data?: Cliente[];
}

// Componente Funcional
export const ClientesTable: React.FC<ClientesTableProps> = ({ data: propData }) => {
  const navigate = useNavigate();
  const { data: clientesData, isLoading } = useClientes();
  const deleteMutation = useDeleteCliente();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null);

  const data = propData || clientesData || [];

  // Definição das Colunas
  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: 'razaoSocial',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cliente
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const tipoPessoa = row.original.tipoPessoa;
        return (
          <div className="flex items-center space-x-2">
            <div>
              <div className="font-medium">{row.getValue('razaoSocial')}</div>
              {row.original.nomeFantasia && (
                <div className="text-sm text-muted-foreground">{row.original.nomeFantasia}</div>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {tipoPessoa === 'juridica' ? 'PJ' : 'PF'}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'cpfCnpj',
      header: 'CPF/CNPJ',
      cell: ({ row }) => {
        return <div className="font-mono text-sm">{row.getValue('cpfCnpj')}</div>;
      },
    },
    {
      accessorKey: 'segmento',
      header: 'Segmento',
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.getValue('segmento')}</Badge>;
      },
    },
    {
      accessorKey: 'email',
      header: 'E-mail',
      cell: ({ row }) => {
        return <div className="text-sm text-muted-foreground">{row.getValue('email')}</div>;
      },
    },
    {
      accessorKey: 'telefonePrincipal',
      header: 'Telefone',
      cell: ({ row }) => {
        return <div className="font-mono text-sm">{row.getValue('telefonePrincipal')}</div>;
      },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = row.getValue('tags') as string[] | undefined;
        if (!tags || tags.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const cliente = row.original;

        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(cliente.id!)}
              title="Ver detalhes"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(cliente.id!)}
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(cliente.id!)}
              title="Excluir"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Configuração da Tabela
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  // Funções de Manipulação de Eventos
  const handleView = (id: string) => {
    navigate(`/crm/clientes/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/crm/clientes/${id}/editar`);
  };

  const handleDeleteClick = (id: string) => {
    setClienteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (clienteToDelete) {
      try {
        await deleteMutation.mutateAsync(clienteToDelete);
        setDeleteDialogOpen(false);
        setClienteToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-medium">Carregando clientes...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Aguarde enquanto buscamos os dados
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <div className="text-lg font-medium">Nenhum cliente cadastrado</div>
          <div className="text-sm text-muted-foreground mt-2">
            Clique em "Novo Cliente" para começar
          </div>
        </div>
      </div>
    );
  }

  // Retorno JSX
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Buscar por cliente..."
          value={(table.getColumn('razaoSocial')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('razaoSocial')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} cliente(s) encontrado(s)
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between space-x-2">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
