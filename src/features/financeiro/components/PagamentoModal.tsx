import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Titulo } from '@/lib/mockDataFinanceiro';

interface PagamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
    titulo: Titulo;
    onSave: (data: any) => void;
}

export const PagamentoModal: React.FC<PagamentoModalProps> = ({
    isOpen,
    onClose,
    titulo,
    onSave,
}) => {
    const [valorRecebido, setValorRecebido] = useState<number>(titulo.valorAtual);
    const [dataPagamento, setDataPagamento] = useState<string>(new Date().toISOString().split('T')[0]);
    const [formaPagamento, setFormaPagamento] = useState<string>('pix');
    const [contaDestino, setContaDestino] = useState<string>('itau-pj');
    const [observacoes, setObservacoes] = useState('');

    const handleSave = () => {
        onSave({
            id: titulo.id,
            valorRecebido,
            dataPagamento,
            formaPagamento,
            contaDestino,
            observacoes
        });
        onClose();
    };

    const formatCurrency = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Pagamento</DialogTitle>
                    <DialogDescription>
                        Confirmar o recebimento/pagamento do título: <span className="font-bold text-foreground">{titulo.descricao}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="bg-muted/30 p-3 rounded-md border border-muted-foreground/10 mb-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Valor Original:</span>
                            <span className="font-medium">{formatCurrency(titulo.valorOriginal)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                            <span className="text-muted-foreground font-bold">Saldo devedor:</span>
                            <span className="font-bold text-primary">{formatCurrency(titulo.valorAtual)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="valor">Valor Recebido (R$)</Label>
                            <Input
                                id="valor"
                                type="number"
                                step="0.01"
                                value={valorRecebido}
                                onChange={(e) => setValorRecebido(parseFloat(e.target.value) || 0)}
                                className="h-9 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="data">Data de Pagamento</Label>
                            <Input
                                id="data"
                                type="date"
                                value={dataPagamento}
                                onChange={(e) => setDataPagamento(e.target.value)}
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="forma">Forma de Pagamento</Label>
                        <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="cartao_credito">Cartão Crédito</SelectItem>
                                <SelectItem value="cartao_debito">Cartão Débito</SelectItem>
                                <SelectItem value="boleto">Boleto</SelectItem>
                                <SelectItem value="transferencia">Transferência</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="conta">Conta de Destino / Origem</Label>
                        <Select value={contaDestino} onValueChange={setContaDestino}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Selecione a conta..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="itau-pj">Itaú PJ - 1234-5</SelectItem>
                                <SelectItem value="nubank">Nubank - Djob Entretenimento</SelectItem>
                                <SelectItem value="caixa-rh">Caixa - Folha Pagamento</SelectItem>
                                <SelectItem value="cofre">Cofre Físico (Dinheiro)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="obs">Observações</Label>
                        <Textarea
                            id="obs"
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            placeholder="Informações adicionais da transação..."
                            className="text-sm min-h-[80px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="h-9">Cancelar</Button>
                    <Button onClick={handleSave} className="h-9 bg-green-600 hover:bg-green-700">Confirmar Baixa</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
