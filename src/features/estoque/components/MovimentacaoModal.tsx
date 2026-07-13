import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { itensEstoqueMock } from '@/lib/mockDataEstoque';

interface MovimentacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const MovimentacaoModal: React.FC<MovimentacaoModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [itemId, setItemId] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [motivo, setMotivo] = useState('');

  const handleSave = () => {
    if (!itemId || quantidade <= 0) {
      alert('Preencha os campos obrigatórios');
      return;
    }
    onSave({ tipo, itemId, quantidade, motivo });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Movimentação de Estoque</DialogTitle>
          <DialogDescription>Registre uma entrada ou saída física de materiais.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Movimentação</Label>
            <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada (+)</SelectItem>
                <SelectItem value="saida">Saída (-)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Item / Produto</Label>
            <Select value={itemId} onValueChange={setItemId}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione um item..." />
              </SelectTrigger>
              <SelectContent>
                {itensEstoqueMock.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.itemNome} ({item.itemSku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(parseFloat(e.target.value) || 0)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo / Observação</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: Compra NF 123, Ajuste de inventário, etc."
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Movimentação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
