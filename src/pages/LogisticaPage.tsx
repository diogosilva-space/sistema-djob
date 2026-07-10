import React from 'react';
import {
    Search,
    Filter,
    Truck,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    MapPin,
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

import { protocolosMock } from '@/lib/mockDataLogistica';
import { format } from 'date-fns';

export const LogisticaPage: React.FC = () => {
    const navigate = useNavigate();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Entregue': return 'default';
            case 'Em Trânsito': return 'secondary';
            case 'Aguardando Entrega': return 'outline';
            case 'Recusado': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Logística</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestão de entregas e protocolos de recebimento
                    </p>
                </div>
                <Button onClick={() => navigate('/logistica/protocolos/novo')} className="h-9 gap-2">
                    <Truck size={16} />
                    Novo Protocolo de Entrega
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm border-muted/40 font-inter">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Entregas Hoje
                        </CardTitle>
                        <Truck size={14} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                            Saindo do depósito
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40 font-inter">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Em Trânsito
                        </CardTitle>
                        <Clock size={14} className="text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                            Aguardando confirmação
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40 font-inter">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Entregues (Mês)
                        </CardTitle>
                        <CheckCircle2 size={14} className="text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                            Sucesso nas entregas
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40 font-inter">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Lead Time Médio
                        </CardTitle>
                        <Clock size={14} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.2h</div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                            Da saída à entrega
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm border-muted/40">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-base">Protocolos de Entrega</CardTitle>
                            <CardDescription className="text-xs">Rastreie o status de todas as entregas realizadas</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Buscar por protocolo ou cliente..." className="h-9 pl-9 text-xs" />
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
                                    <TableHead className="text-xs font-semibold">Protocolo</TableHead>
                                    <TableHead className="text-xs font-semibold">Cliente</TableHead>
                                    <TableHead className="text-xs font-semibold">Destino</TableHead>
                                    <TableHead className="text-xs font-semibold">Saída</TableHead>
                                    <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                                    <TableHead className="w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {protocolosMock.map((prot) => (
                                    <TableRow key={prot.id} className="hover:bg-muted/20 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold leading-none mb-1">{prot.numero}</span>
                                                <span className="text-[11px] font-mono text-muted-foreground">REF: {prot.pedidoVendaId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[13px] font-bold">{prot.clienteNome}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground max-w-[200px] truncate">
                                                <MapPin size={10} className="shrink-0" />
                                                {prot.enderecoDestino}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[13px] text-muted-foreground">
                                            {format(prot.dataSaida, 'dd/MM/yyyy HH:mm')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getStatusColor(prot.status) as any} className="h-5 text-[10px] uppercase font-bold">
                                                {prot.status}
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
                                                        <FileText size={14} /> Ver Protocolo PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                                        <CheckCircle2 size={14} /> Confirmar Entrega
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                                        <Truck size={14} /> Atualizar Rastreio
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
