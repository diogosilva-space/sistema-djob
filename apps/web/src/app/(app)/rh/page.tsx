'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, RefreshCw, UserCheck, Briefcase, Users, FileText, ChevronRight, User } from 'lucide-react';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { rhService } from '@/features/rh/api/rh.service';
import Link from 'next/link';

export default function RhPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await rhService.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Erro ao carregar colaboradores', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            Ativo
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Afastado
          </span>
        );
      case 'TERMINATED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
            Desligado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={Users}
        title="Recursos Humanos"
        subtitle="Gestão de colaboradores, registros Admissionais, cargos e folha salarial"
      >
        <Button variant="outline" onClick={loadEmployees} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
        <Link href="/rh/novo">
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            Admitir Colaborador
          </Button>
        </Link>
      </PageActionHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border border-border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Colaboradores Ativos
            </CardTitle>
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular-nums font-bold text-foreground">
              {employees.filter((e) => e.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Folha Mensal Estimada (Ativos)
            </CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular-nums font-bold text-foreground">
              R${' '}
              {employees
                .filter((e) => e.status === 'ACTIVE')
                .reduce((acc, e) => acc + Number(e.salary || 0), 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold text-foreground">Quadro de Funcionários</CardTitle>
          <CardDescription>Visualização completa dos contratos ativos e desligados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Carregando quadro de colaboradores...</div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Nenhum colaborador registrado. Clique em &quot;Admitir Colaborador&quot; para iniciar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/70">
                  <TableHead className="pl-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">Nome Completo</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cargo / Função</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Departamento</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data Admissão</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">Salário Base</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Situação</TableHead>
                  <TableHead className="pr-6 text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-muted/50">
                    <TableCell className="pl-6 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center border border-border">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span>{emp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{emp.position || '—'}</TableCell>
                    <TableCell className="text-muted-foreground font-semibold">{emp.department || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {emp.admissionDate
                        ? new Date(emp.admissionDate).toLocaleDateString('pt-BR')
                        : '—'}
                    </TableCell>
                    <TableCell className="tabular-nums font-bold text-foreground text-right text-base">
                      R$ {Number(emp.salary || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(emp.status)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Link href={`/rh/novo?id=${emp.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border text-foreground hover:bg-muted active:scale-[0.97] transition-all flex items-center gap-1 ml-auto"
                        >
                          <span>Ficha</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
