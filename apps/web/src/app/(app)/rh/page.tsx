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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-705 border border-emerald-100">
            Ativo
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-705 border border-amber-200">
            Afastado
          </span>
        );
      case 'TERMINATED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
            Desligado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Recursos Humanos</h1>
            <p className="text-sm text-slate-500">
              Gestão de colaboradores, registros Admissionais, cargos e folha salarial
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadEmployees}
            className="border-slate-200 hover:bg-slate-100 text-slate-700 active:scale-[0.98] transition-transform"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Atualizar</span>
          </Button>
          <Link href="/rh/novo">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 active:scale-[0.98] transition-transform">
              <Plus className="h-4 w-4" />
              <span>Admitir Colaborador</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Colaboradores Ativos
            </CardTitle>
            <UserCheck className="h-5 w-5 text-emerald-650" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-slate-900">
              {employees.filter((e) => e.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Folha Mensal Estimada (Ativos)
            </CardTitle>
            <Briefcase className="h-5 w-5 text-slate-650" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-slate-950">
              R${' '}
              {employees
                .filter((e) => e.status === 'ACTIVE')
                .reduce((acc, e) => acc + Number(e.salary || 0), 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-900">Quadro de Funcionários</CardTitle>
          <CardDescription>Visualização completa dos contratos ativos e desligados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Carregando quadro de colaboradores...</div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              Nenhum colaborador registrado. Clique em &quot;Admitir Colaborador&quot; para iniciar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">Nome Completo</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Cargo / Função</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Departamento</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Data Admissão</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Salário Base</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Situação</TableHead>
                  <TableHead className="pr-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                          <User className="h-4 w-4 text-slate-650" />
                        </div>
                        <span>{emp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">{emp.position || '—'}</TableCell>
                    <TableCell className="text-slate-550 font-semibold">{emp.department || '—'}</TableCell>
                    <TableCell className="text-slate-500">
                      {emp.admissionDate
                        ? new Date(emp.admissionDate).toLocaleDateString('pt-BR')
                        : '—'}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-slate-900 text-right text-base">
                      R$ {Number(emp.salary || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(emp.status)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Link href={`/rh/novo?id=${emp.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.97] transition-all flex items-center gap-1 ml-auto"
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
