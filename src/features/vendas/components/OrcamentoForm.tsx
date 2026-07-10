import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit } from 'lucide-react';
import { nanoid } from 'nanoid';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

import { ItemOrcamento, Personalizacao } from '../types/Orcamento.types';
import { PersonalizacaoModal } from './PersonalizacaoModal';

import { clientesMock } from '@/lib/mockData';
import { produtosMock } from '@/lib/mockDataProdutos';
import { oportunidadesMock } from '@/lib/mockDataOportunidades';

// Definição de Tipos (Props)
interface OrcamentoFormProps {
  mode?: 'criar' | 'editar';
  initialData?: any;
}

// Componente Funcional
export const OrcamentoForm: React.FC<OrcamentoFormProps> = ({
  mode = 'criar',
  initialData,
}) => {
  const navigate = useNavigate();

  // Estado do formulário
  const [numero] = useState(`ORC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`);
  const [clienteId, setClienteId] = useState('');
  const [validade, setValidade] = useState('30 dias');
  const [vendedorId] = useState('vendedor1');
  const [oportunidadeId, setOportunidadeId] = useState('');
  const [observacoesInternas, setObservacoesInternas] = useState('');
  
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [freteEstimado, setFreteEstimado] = useState(0);
  const [descontoGlobalPorcentagem, setDescontoGlobalPorcentagem] = useState(0);

  // Modal de personalização
  const [personalizacaoModalOpen, setPersonalizacaoModalOpen] = useState(false);
  const [itemEditandoPersonalizacao, setItemEditandoPersonalizacao] = useState<string | null>(null);

  // Preparar opções para Combobox
  const clientesOptions: ComboboxOption[] = clientesMock.map((c) => ({
    value: c.id!,
    label: c.razaoSocial,
    description: c.cpfCnpj,
  }));

  const produtosOptions: ComboboxOption[] = produtosMock.map((p) => ({
    value: p.id,
    label: p.nome,
    description: `SKU: ${p.sku} | R$ ${p.precoVenda.toFixed(2)}`,
  }));

  const oportunidadesOptions: ComboboxOption[] = oportunidadesMock.map((o) => ({
    value: o.id,
    label: o.nomeCliente,
    description: `R$ ${o.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  }));

  // Handlers para itens
  const handleAddItem = (produtoId: string) => {
    if (!produtoId) return;

    const produto = produtosMock.find((p) => p.id === produtoId);
    if (!produto) return;

    const novoItem: ItemOrcamento = {
      id: nanoid(),
      produtoId: produto.id,
      produtoNome: produto.nome,
      produtoDescricao: produto.descricao,
      quantidade: 1,
      unidade: produto.unidade,
      precoUnitario: produto.precoVenda,
      desconto: 0,
      subtotal: produto.precoVenda,
    };

    setItens((prev) => [...prev, novoItem]);
  };

  const handleUpdateItem = (itemId: string, field: keyof ItemOrcamento, value: any) => {
    setItens((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        const updated = { ...item, [field]: value };

        // Recalcular subtotal
        const subtotalSemDesconto = updated.quantidade * updated.precoUnitario;
        const descontoValor = subtotalSemDesconto * (updated.desconto / 100);
        updated.subtotal = subtotalSemDesconto - descontoValor;

        return updated;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setItens((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleOpenPersonalizacao = (itemId: string) => {
    setItemEditandoPersonalizacao(itemId);
    setPersonalizacaoModalOpen(true);
  };

  const handleSavePersonalizacao = (personalizacao: Personalizacao) => {
    if (!itemEditandoPersonalizacao) return;

    setItens((prev) =>
      prev.map((item) =>
        item.id === itemEditandoPersonalizacao
          ? { ...item, personalizacao }
          : item
      )
    );

    setItemEditandoPersonalizacao(null);
  };

  // Cálculos do resumo financeiro
  const subtotalProdutos = itens.reduce((acc, item) => acc + item.subtotal, 0);
  const custoPersonalizacao = itens.reduce(
    (acc, item) => acc + (item.personalizacao?.custoCalculado || 0) * item.quantidade,
    0
  );
  const descontoGlobalValor = (subtotalProdutos + custoPersonalizacao + freteEstimado) * (descontoGlobalPorcentagem / 100);
  const total = subtotalProdutos + custoPersonalizacao + freteEstimado - descontoGlobalValor;

  // Handler de submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteId) {
      alert('Selecione um cliente');
      return;
    }

    if (itens.length === 0) {
      alert('Adicione pelo menos um item ao orçamento');
      return;
    }

    const orcamento = {
      numero,
      clienteId,
      validade,
      vendedorId,
      oportunidadeId,
      observacoesInternas,
      itens,
      subtotalProdutos,
      custoPersonalizacao,
      freteEstimado,
      descontoGlobalPorcentagem,
      descontoGlobalValor,
      total,
    };

    console.log('Orçamento criado:', orcamento);
    alert('Orçamento criado com sucesso!');
    navigate('/vendas');
  };

  // Retorno JSX
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cabeçalho do Orçamento */}
      <Card>
        <CardHeader>
          <CardTitle>Cabeçalho do Orçamento</CardTitle>
          <CardDescription>
            Informações gerais do orçamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="numero">Número do Orçamento</Label>
              <Input id="numero" value={numero} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataEmissao">Data de Emissão</Label>
              <Input
                id="dataEmissao"
                value={new Date().toLocaleDateString('pt-BR')}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">
                Cliente <span className="text-destructive">*</span>
              </Label>
              <Combobox
                options={clientesOptions}
                value={clienteId}
                onValueChange={setClienteId}
                placeholder="Selecione o cliente"
                searchPlaceholder="Buscar por nome ou CNPJ..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validade">
                Validade <span className="text-destructive">*</span>
              </Label>
              <Select value={validade} onValueChange={setValidade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15 dias">15 dias</SelectItem>
                  <SelectItem value="30 dias">30 dias</SelectItem>
                  <SelectItem value="60 dias">60 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oportunidade">Oportunidade Vinculada</Label>
              <Combobox
                options={oportunidadesOptions}
                value={oportunidadeId}
                onValueChange={setOportunidadeId}
                placeholder="Selecione a oportunidade (opcional)"
                searchPlaceholder="Buscar oportunidade..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Internas</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações que não aparecerão no PDF do orçamento..."
              value={observacoesInternas}
              onChange={(e) => setObservacoesInternas(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">
              {observacoesInternas.length}/500
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Itens do Orçamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Itens do Orçamento</CardTitle>
              <CardDescription>
                Adicione produtos e configure personalizações
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Combobox
                options={produtosOptions}
                value=""
                onValueChange={handleAddItem}
                placeholder="Adicionar produto..."
                searchPlaceholder="Buscar por SKU ou nome..."
                className="w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {itens.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <p className="text-muted-foreground">
                Nenhum item adicionado. Selecione um produto acima para começar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="w-24">Qtd</TableHead>
                  <TableHead className="w-28">Preço Unit.</TableHead>
                  <TableHead className="w-24">Desc. %</TableHead>
                  <TableHead className="w-28">Subtotal</TableHead>
                  <TableHead className="w-32">Personalização</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.produtoNome}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.produtoDescricao}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) =>
                          handleUpdateItem(
                            item.id,
                            'quantidade',
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.precoUnitario}
                        onChange={(e) =>
                          handleUpdateItem(
                            item.id,
                            'precoUnitario',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.desconto}
                        onChange={(e) =>
                          handleUpdateItem(
                            item.id,
                            'desconto',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {item.subtotal.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant={item.personalizacao ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleOpenPersonalizacao(item.id)}
                      >
                        {item.personalizacao ? (
                          <>
                            <Edit className="h-3 w-3 mr-1" />
                            R$ {item.personalizacao.custoCalculado.toFixed(2)}
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Personalizar
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="frete">Frete Estimado (R$)</Label>
              <Input
                id="frete"
                type="number"
                step="0.01"
                min="0"
                value={freteEstimado}
                onChange={(e) => setFreteEstimado(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descontoGlobal">Desconto Global (%)</Label>
              <Input
                id="descontoGlobal"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={descontoGlobalPorcentagem}
                onChange={(e) =>
                  setDescontoGlobalPorcentagem(parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal Produtos:</span>
              <span className="font-medium">
                R$ {subtotalProdutos.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Custo de Personalização:</span>
              <span className="font-medium">
                R$ {custoPersonalizacao.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Frete Estimado:</span>
              <span className="font-medium">R$ {freteEstimado.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Desconto Global:</span>
              <span className="font-medium text-destructive">
                - R$ {descontoGlobalValor.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>TOTAL:</span>
              <span className="text-green-600">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate('/vendas')}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Orçamento</Button>
      </div>

      {/* Modal de Personalização */}
      <PersonalizacaoModal
        open={personalizacaoModalOpen}
        onOpenChange={setPersonalizacaoModalOpen}
        personalizacao={
          itemEditandoPersonalizacao
            ? itens.find((i) => i.id === itemEditandoPersonalizacao)?.personalizacao
            : undefined
        }
        onSave={handleSavePersonalizacao}
      />
    </form>
  );
};
