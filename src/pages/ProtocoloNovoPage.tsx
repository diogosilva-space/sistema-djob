import React from 'react';
import {
    ChevronLeft,
    Save,
    Truck,
    Search,
    Package,
    MapPin,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

export const ProtocoloNovoPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSave = () => {
        alert('Protocolo de entrega gerado com sucesso!');
        navigate('/logistica');
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigate('/logistica')}>
                        <ChevronLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Novo Protocolo de Entrega</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Formalize o envio de mercadorias para o cliente
                        </p>
                    </div>
                </div>
                <Button onClick={handleSave} className="gap-2 font-bold h-10 px-6">
                    <Save size={18} />
                    Gerar Protocolo
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-muted/40">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Package size={18} className="text-primary" />
                                Vínculo com Pedido
                            </CardTitle>
                            <CardDescription className="text-xs">Selecione o pedido de venda para carregar os itens</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="pedido">Pedido de Venda</Label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="pedido" placeholder="Buscar por número do pedido ou cliente..." className="pl-9 h-10" />
                                </div>
                            </div>

                            <div className="rounded-md border p-4 bg-muted/20">
                                <div className="grid grid-cols-2 gap-4 text-[13px]">
                                    <div>
                                        <span className="text-muted-foreground font-medium">Cliente:</span>
                                        <p className="font-bold">Restaurante Sabor & Arte</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-medium">Data do Pedido:</span>
                                        <p className="font-bold">20/01/2026</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-muted/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Itens para Entrega</CardTitle>
                            <CardDescription className="text-xs">Confira as quantidades que serão despachadas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-xs font-semibold h-10">Item</TableHead>
                                        <TableHead className="text-xs font-semibold h-10 text-right">Qtd. Pedida</TableHead>
                                        <TableHead className="text-xs font-semibold h-10 text-right">Qtd. a Entregar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="py-3">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold">Camiseta Algodão Branca</span>
                                                <span className="text-[11px] text-muted-foreground font-mono">PROD-CAM-001</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-[13px] font-medium py-3">50 Un</TableCell>
                                        <TableCell className="text-right py-3">
                                            <Input type="number" defaultValue={50} className="h-8 w-20 ml-auto text-right text-[13px]" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="py-3">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold">Boné 5 Gomos Preto</span>
                                                <span className="text-[11px] text-muted-foreground font-mono">PROD-BON-001</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-[13px] font-medium py-3">20 Un</TableCell>
                                        <TableCell className="text-right py-3">
                                            <Input type="number" defaultValue={20} className="h-8 w-20 ml-auto text-right text-[13px]" />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm border-muted/40">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Truck size={18} className="text-primary" />
                                Dados da Saída
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="dataSaida">Data de Saída</Label>
                                <div className="flex gap-2">
                                    <Input id="dataSaida" type="date" className="h-9 text-xs" />
                                    <Input type="time" className="h-9 text-xs w-24" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="entregador">Entregue por</Label>
                                <Select>
                                    <SelectTrigger id="entregador" className="h-9 text-xs">
                                        <SelectValue placeholder="Selecione o portador..." />
                                    </SelectTrigger>
                                    <SelectContent className="text-xs">
                                        <SelectItem value="marcio">Marcio Motoboy</SelectItem>
                                        <SelectItem value="carlos">Carlos Express</SelectItem>
                                        <SelectItem value="sedex">Correios (SEDEX)</SelectItem>
                                        <SelectItem value="proprio">Retirada pelo Cliente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destino</Label>
                                <div className="flex items-start gap-2 bg-muted/20 p-3 rounded-md border text-[12px]">
                                    <MapPin size={14} className="text-primary mt-0.5" />
                                    <div>
                                        <p className="font-bold">Restaurante Sabor & Arte</p>
                                        <p className="text-muted-foreground">Av. Paulista, 1000 - Bela Vista</p>
                                        <p className="text-muted-foreground">São Paulo - SP | CEP: 01310-100</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-muted/40 bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4 text-primary">
                                <FileText size={24} />
                                <div>
                                    <h4 className="font-bold text-sm">Resumo do Protocolo</h4>
                                    <p className="text-[11px] opacity-80">Um PDF será gerado para assinatura física ou digital.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
