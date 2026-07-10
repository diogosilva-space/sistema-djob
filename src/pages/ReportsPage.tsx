import React from 'react';
import {
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export const ReportsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Relatórios & BI</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Análise de performance e indicadores do sistema
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 gap-2 text-xs">
                        <Download size={14} />
                        Exportar dados
                    </Button>
                    <Button className="h-9 gap-2 text-xs">
                        <Calendar size={14} />
                        Período: Últimos 30 dias
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm border-muted/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                            Faturamento Bruto
                            <TrendingUp size={12} className="text-success" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 156.420,00</div>
                        <div className="flex items-center gap-1 text-[11px] text-success font-medium mt-1">
                            <ArrowUpRight size={12} />
                            <span>+12.5% em relação ao mês anterior</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                            Ticket Médio
                            <TrendingUp size={12} className="text-success" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 4.250,15</div>
                        <div className="flex items-center gap-1 text-[11px] text-success font-medium mt-1">
                            <ArrowUpRight size={12} />
                            <span>+3.2% em relação ao mês anterior</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                            Custo de Produção
                            <ArrowDownRight size={12} className="text-destructive" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 68.310,00</div>
                        <div className="flex items-center gap-1 text-[11px] text-destructive font-medium mt-1">
                            <ArrowUpRight size={12} />
                            <span>+8.1% (aumento de insumos)</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                            Margem Líquida
                            <TrendingUp size={12} className="text-success" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24.5%</div>
                        <div className="flex items-center gap-1 text-[11px] text-success font-medium mt-1">
                            <ArrowUpRight size={12} />
                            <span>+1.5% melhoria operacional</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-sm border-muted/40">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <BarChart3 size={18} className="text-primary" />
                            Vendas por Vendedor
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20 border-dashed">
                            <div className="text-center space-y-2">
                                <BarChart3 size={32} className="mx-auto text-muted-foreground opacity-20" />
                                <p className="text-xs text-muted-foreground font-medium">Gráfico de barras de performance individual</p>
                                <div className="flex gap-2 justify-center">
                                    <Badge variant="outline" className="text-[10px]">João Silva: R$ 45k</Badge>
                                    <Badge variant="outline" className="text-[10px]">Maria Clara: R$ 38k</Badge>
                                    <Badge variant="outline" className="text-[10px]">Ana Paula: R$ 32k</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/40">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <PieChartIcon size={18} className="text-primary" />
                            Mix de Produtos (Faturamento)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20 border-dashed">
                            <div className="text-center space-y-2">
                                <PieChartIcon size={32} className="mx-auto text-muted-foreground opacity-20" />
                                <p className="text-xs text-muted-foreground font-medium">Distribuição por categoria</p>
                                <div className="flex gap-2 justify-center">
                                    <Badge variant="secondary" className="text-[10px]">Brindes: 62%</Badge>
                                    <Badge variant="secondary" className="text-[10px]">Confecção: 38%</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm border-muted/40">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Análise de Lucratividade por Pedido</CardTitle>
                        <Select defaultValue="top-10">
                            <SelectTrigger className="w-[180px] h-8 text-xs">
                                <SelectValue placeholder="Filtrar por..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="top-10">Top 10 mais rentáveis</SelectItem>
                                <SelectItem value="bottom-10">10 menos rentáveis</SelectItem>
                                <SelectItem value="recent">Mais recentes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-bold">Pedido #2026-004{i}</h4>
                                        <p className="text-[11px] text-muted-foreground">Cliente: Restaurante Sabor & Arte</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[13px] font-bold">Margem: 32.5%</div>
                                    <div className="text-[11px] text-success font-medium">LUCRO: R$ 2.450,00</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
