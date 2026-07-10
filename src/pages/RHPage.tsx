import React from 'react';
import {
    Search,
    Filter,
    Users,
    UserPlus,
    Calendar,
    DollarSign,
    MoreHorizontal,
    Mail,
    Phone,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { funcionariosMock } from '@/lib/mockDataRH';
import { format } from 'date-fns';

export const RHPage: React.FC = () => {
    const navigate = useNavigate();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo': return 'default';
            case 'Afastado': return 'secondary';
            case 'Desligado': return 'destructive';
            default: return 'outline';
        }
    };

    const formatCurrency = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Recursos Humanos</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestão de colaboradores e prestadores de serviço
                    </p>
                </div>
                <Button onClick={() => navigate('/rh/funcionarios/novo')} className="h-9 gap-2">
                    <UserPlus size={16} />
                    Novo Funcionário
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm border-muted/40 font-inter">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Total Colaboradores
                        </CardTitle>
                        <Users size={14} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{funcionariosMock.length}</div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                            Funcionários ativos no sistema
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40 font-inter">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Admissões (Mês)
                        </CardTitle>
                        <UserPlus size={14} className="text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2</div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                            Novos membros na equipe
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40 font-inter">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Férias/Afastamentos
                        </CardTitle>
                        <Calendar size={14} className="text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                            Colaboradores ausentes hoje
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40 font-inter">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Folha Mensal (Est.)
                        </CardTitle>
                        <DollarSign size={14} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(45800)}</div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                            Projeção de salários base
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm border-muted/40">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-base">Quadro de Funcionários</CardTitle>
                            <CardDescription className="text-xs">Visualize e gerencie as informações de todos os colaboradores</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Buscar por nome ou CPF..." className="h-9 pl-9 text-xs" />
                            </div>
                            <Button variant="outline" className="h-9 gap-2 text-xs">
                                <Filter size={14} />
                                Filtros
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-muted/60 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-xs font-semibold">Funcionário</TableHead>
                                    <TableHead className="text-xs font-semibold">Cargo/Função</TableHead>
                                    <TableHead className="text-xs font-semibold">Contato</TableHead>
                                    <TableHead className="text-xs font-semibold">Admissão</TableHead>
                                    <TableHead className="text-xs font-semibold text-right">Salário Base</TableHead>
                                    <TableHead className="w-[100px] text-xs font-semibold text-center">Status</TableHead>
                                    <TableHead className="w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {funcionariosMock.map((func) => (
                                    <TableRow key={func.id} className="hover:bg-muted/20 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold leading-none mb-1">{func.nomeCompleto}</span>
                                                <span className="text-[11px] font-mono text-muted-foreground">{func.cpf}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[13px] font-medium">{func.funcaoCargo}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                    <Phone size={10} /> {func.celular}
                                                </div>
                                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                    <Mail size={10} /> {func.id}@djob.com.br
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[13px] text-muted-foreground">
                                            {format(func.dataAdmissao, 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell className="text-right text-[13px] font-mono font-medium">
                                            {formatCurrency(func.salarioBase)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getStatusColor(func.status) as any} className="h-5 text-[10px] uppercase font-bold">
                                                {func.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal size={14} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="text-xs">
                                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                                        <FileText size={14} /> Ver Ficha Completa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                                        <Calendar size={14} /> Registrar Ponto
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                                        <DollarSign size={14} /> Histórico Salarial
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
