import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { Plus, Trash2, Clock, Ruler, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { nanoid } from 'nanoid';

import { Produto, TipoProduto, UnidadeMedida, MateriaPrima } from '../types/Produto.types';
import { categoriasMock } from '@/lib/mockDataCategorias';
import { fornecedoresMock } from '@/lib/mockDataFornecedores';
import { materiaisMock } from '@/lib/mockDataMateriais';

interface ProdutoFormProps {
  mode?: 'criar' | 'editar';
  initialData?: Produto;
}

export const ProdutoForm: React.FC<ProdutoFormProps> = ({
  initialData,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Produto>>(
    initialData || {
      sku: `PRD-${Date.now()}`,
      tipoProduto: 'brinde',
      status: 'ativo',
      unidadeMedida: 'Unidade',
      margemLucroPadrao: 50,
      precoVendaPraticado: 0,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    }
  );

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Funções para BOM (Ficha Técnica)
  const addBomItem = () => {
    const newBom: MateriaPrima[] = [
      ...(formData.bom || []),
      {
        id: nanoid(),
        materialId: '',
        materialNome: '',
        quantidade: 1,
        unidade: 'Unidade',
        custoUnitario: 0,
        custoTotal: 0,
      },
    ];
    handleFieldChange('bom', newBom);
  };

  const removeBomItem = (id: string) => {
    const newBom = (formData.bom || []).filter((item) => item.id !== id);
    handleFieldChange('bom', newBom);
  };

  const updateBomItem = (id: string, field: keyof MateriaPrima, value: any) => {
    const newBom = (formData.bom || []).map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Se mudou o material, atualizar dados do material
        if (field === 'materialId') {
          const material = materiaisMock.find((m) => m.id === value);
          if (material) {
            updatedItem.materialNome = material.nome;
            updatedItem.unidade = material.unidade;
            updatedItem.custoUnitario = material.custoUnitario;
          }
        }

        // Recalcular custo total do item
        updatedItem.custoTotal = updatedItem.quantidade * updatedItem.custoUnitario;
        return updatedItem;
      }
      return item;
    });
    handleFieldChange('bom', newBom);
  };

  const toggleTamanho = (tamanho: string) => {
    const current = formData.tamanhosDisponiveis || [];
    const updated = current.includes(tamanho)
      ? current.filter((t) => t !== tamanho)
      : [...current, tamanho];
    handleFieldChange('tamanhosDisponiveis', updated);
  };

  const toggleCor = (cor: string) => {
    const current = formData.coresDisponiveis || [];
    const updated = current.includes(cor)
      ? current.filter((c) => c !== cor)
      : [...current, cor];
    handleFieldChange('coresDisponiveis', updated);
  };

  // Calcular custo de produção baseado na BOM
  useEffect(() => {
    if (formData.tipoProduto === 'confeccao') {
      const totalBom = (formData.bom || []).reduce((acc, item) => acc + item.custoTotal, 0);
      if (totalBom !== formData.custoProducao) {
        handleFieldChange('custoProducao', totalBom);
      }
    }
  }, [formData.bom, formData.tipoProduto]);

  // Calcular preço sugerido
  useEffect(() => {
    const custo = formData.tipoProduto === 'brinde'
      ? formData.custoCompraUltima || 0
      : formData.custoProducao || 0;

    const sugerido = custo * (1 + (formData.margemLucroPadrao || 0) / 100);
    setFormData((prev) => ({ ...prev, precoVendaSugerido: sugerido }));
  }, [formData.custoCompraUltima, formData.custoProducao, formData.margemLucroPadrao, formData.tipoProduto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.descricaoCurta) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    console.log('Produto salvo:', formData);
    alert('Produto salvo com sucesso!');
    navigate('/produtos');
  };

  const fornecedoresOptions: ComboboxOption[] = fornecedoresMock.map((f) => ({
    value: f.id,
    label: f.razaoSocial,
    description: f.cnpj,
  }));

  const subcategorias = categoriasMock
    .find((c) => c.id === formData.categoriaId)
    ?.subcategorias || [];

  const materiaisOptions: ComboboxOption[] = materiaisMock.map((m) => ({
    value: m.id,
    label: m.nome,
    description: `${m.sku} - R$ ${m.custoUnitario.toFixed(2)}/${m.unidade}`,
  }));

  const tamanhosOpcoes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'U'];
  const coresOpcoes = [
    { nome: 'Branco', hex: '#FFFFFF' },
    { nome: 'Preto', hex: '#000000' },
    { nome: 'Azul Marinho', hex: '#000080' },
    { nome: 'Cinza Mescla', hex: '#BEBEBE' },
    { nome: 'Vermelho', hex: '#FF0000' },
    { nome: 'Verde Bandeira', hex: '#008000' },
    { nome: 'Amarelo', hex: '#FFFF00' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
          {formData.tipoProduto === 'brinde' && (
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
          )}
          {formData.tipoProduto === 'confeccao' && (
            <TabsTrigger value="ficha">Ficha Técnica</TabsTrigger>
          )}
          <TabsTrigger value="custos">Custos e Preços</TabsTrigger>
        </TabsList>

        {/* Aba: Informações Gerais */}
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Dados básicos do produto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">
                    SKU <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleFieldChange('sku', e.target.value)}
                    placeholder="PRD-001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">
                    Nome do Produto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome || ''}
                    onChange={(e) => handleFieldChange('nome', e.target.value)}
                    placeholder="Ex: Caneca Personalizada"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descricaoCurta">
                    Descrição Curta <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="descricaoCurta"
                    value={formData.descricaoCurta || ''}
                    onChange={(e) => handleFieldChange('descricaoCurta', e.target.value)}
                    placeholder="Descrição breve para listagens"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.descricaoCurta?.length || 0}/100
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descricaoCompleta">Descrição Completa</Label>
                  <Textarea
                    id="descricaoCompleta"
                    value={formData.descricaoCompleta || ''}
                    onChange={(e) => handleFieldChange('descricaoCompleta', e.target.value)}
                    placeholder="Descrição detalhada para o catálogo..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Tipo de Produto <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.tipoProduto}
                    onValueChange={(value) =>
                      handleFieldChange('tipoProduto', value as TipoProduto)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="brinde" id="brinde" />
                      <Label htmlFor="brinde" className="font-normal">
                        Brinde (Comprado)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="confeccao" id="confeccao" />
                      <Label htmlFor="confeccao" className="font-normal">
                        Confecção (Produzido)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidadeMedida">
                    Unidade de Medida <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.unidadeMedida}
                    onValueChange={(value) =>
                      handleFieldChange('unidadeMedida', value as UnidadeMedida)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unidade">Unidade</SelectItem>
                      <SelectItem value="Par">Par</SelectItem>
                      <SelectItem value="Kit">Kit</SelectItem>
                      <SelectItem value="Metro">Metro</SelectItem>
                      <SelectItem value="Kg">Kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">
                    Categoria <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.categoriaId}
                    onValueChange={(value) => {
                      handleFieldChange('categoriaId', value);
                      handleFieldChange('subcategoriaId', '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasMock.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategoria">Subcategoria</Label>
                  <Select
                    value={formData.subcategoriaId}
                    onValueChange={(value) => handleFieldChange('subcategoriaId', value)}
                    disabled={!formData.categoriaId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategorias.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status === 'ativo'}
                    onCheckedChange={(checked) =>
                      handleFieldChange('status', checked ? 'ativo' : 'inativo')
                    }
                  />
                  <Label htmlFor="status">Produto Ativo</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Estoque (Brindes) */}
        {formData.tipoProduto === 'brinde' && (
          <TabsContent value="estoque">
            <Card>
              <CardHeader>
                <CardTitle>Controle de Estoque</CardTitle>
                <CardDescription>Configurações de estoque para brindes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="estoqueAtual">Estoque Atual</Label>
                    <Input
                      id="estoqueAtual"
                      type="number"
                      value={formData.estoqueAtual || 0}
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Atualizado por movimentações
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estoqueMinimo">
                      Estoque Mínimo <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="estoqueMinimo"
                      type="number"
                      min="0"
                      value={formData.estoqueMinimo || ''}
                      onChange={(e) =>
                        handleFieldChange('estoqueMinimo', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estoqueMaximo">Estoque Máximo</Label>
                    <Input
                      id="estoqueMaximo"
                      type="number"
                      min="0"
                      value={formData.estoqueMaximo || ''}
                      onChange={(e) =>
                        handleFieldChange('estoqueMaximo', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input
                      id="localizacao"
                      value={formData.localizacao || ''}
                      onChange={(e) => handleFieldChange('localizacao', e.target.value)}
                      placeholder="Ex: A-01-02"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fornecedor">Fornecedor Principal</Label>
                    <Combobox
                      options={fornecedoresOptions}
                      value={formData.fornecedorPrincipalId || ''}
                      onValueChange={(value) =>
                        handleFieldChange('fornecedorPrincipalId', value)
                      }
                      placeholder="Selecione o fornecedor"
                      searchPlaceholder="Buscar fornecedor..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempoReposicao">Tempo de Reposição (dias)</Label>
                    <Input
                      id="tempoReposicao"
                      type="number"
                      min="1"
                      value={formData.tempoReposicaoDias || ''}
                      onChange={(e) =>
                        handleFieldChange('tempoReposicaoDias', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Aba: Ficha Técnica (Confecção) */}
        {formData.tipoProduto === 'confeccao' && (
          <TabsContent value="ficha" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <CardTitle className="text-base">Tempo de Produção</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={formData.tempoProducaoPadrao || ''}
                      onChange={(e) => handleFieldChange('tempoProducaoPadrao', parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">minutos</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Ruler size={16} className="text-primary" />
                    <CardTitle className="text-base">Grade de Tamanhos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {tamanhosOpcoes.map((t) => (
                      <Badge
                        key={t}
                        variant={formData.tamanhosDisponiveis?.includes(t) ? 'default' : 'outline'}
                        className="cursor-pointer h-7 px-2"
                        onClick={() => toggleTamanho(t)}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Palette size={16} className="text-primary" />
                    <CardTitle className="text-base">Cores Disponíveis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {coresOpcoes.map((c) => (
                      <button
                        key={c.nome}
                        type="button"
                        title={c.nome}
                        onClick={() => toggleCor(c.nome)}
                        className={`h-6 w-6 rounded-full border border-border transition-all ${formData.coresDisponiveis?.includes(c.nome)
                          ? 'ring-2 ring-primary ring-offset-1 scale-110'
                          : 'opacity-70 hover:opacity-100'
                          }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Composição de Materiais (BOM)</CardTitle>
                  <CardDescription>Materiais necessários para produzir 1 unidade</CardDescription>
                </div>
                <Button type="button" size="sm" onClick={addBomItem} className="h-8 gap-1">
                  <Plus size={14} />
                  <span>Adicionar Material</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto border rounded-md">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                      <tr>
                        <th className="px-3 py-2 min-w-[200px]">Material</th>
                        <th className="px-3 py-2 w-24">Qtd.</th>
                        <th className="px-3 py-2 w-24">Unidade</th>
                        <th className="px-3 py-2 w-28">Custo Unit.</th>
                        <th className="px-3 py-2 w-28">Custo Total</th>
                        <th className="px-3 py-2 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(formData.bom || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                            Nenhum material adicionado ainda.
                          </td>
                        </tr>
                      ) : (
                        (formData.bom || []).map((item) => (
                          <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-3 py-1.5">
                              <Combobox
                                options={materiaisOptions}
                                value={item.materialId}
                                onValueChange={(value) => updateBomItem(item.id, 'materialId', value)}
                                placeholder="Selecionar material..."
                                searchPlaceholder="Buscar..."
                                className="h-8 text-xs border-transparent bg-transparent hover:border-input focus:bg-background"
                              />
                            </td>
                            <td className="px-3 py-1.5">
                              <Input
                                type="number"
                                step="0.001"
                                min="0"
                                value={item.quantidade}
                                onChange={(e) => updateBomItem(item.id, 'quantidade', parseFloat(e.target.value) || 0)}
                                className="h-8 text-xs text-right"
                              />
                            </td>
                            <td className="px-3 py-1.5 text-xs text-muted-foreground">
                              {item.unidade}
                            </td>
                            <td className="px-3 py-1.5 text-xs text-right font-mono">
                              R$ {item.custoUnitario.toFixed(2)}
                            </td>
                            <td className="px-3 py-1.5 text-xs text-right font-mono font-medium">
                              R$ {item.custoTotal.toFixed(2)}
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              <button
                                type="button"
                                onClick={() => removeBomItem(item.id)}
                                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    {(formData.bom || []).length > 0 && (
                      <tfoot className="bg-muted/30 font-medium">
                        <tr>
                          <td colSpan={4} className="px-3 py-2 text-right">Custo Total da Composição:</td>
                          <td className="px-3 py-2 text-right text-primary font-bold">
                            R$ {(formData.bom || []).reduce((acc, item) => acc + item.custoTotal, 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Aba: Custos e Preços */}
        <TabsContent value="custos">
          <Card>
            <CardHeader>
              <CardTitle>Custos e Preços</CardTitle>
              <CardDescription>Definição de custos e preços de venda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {formData.tipoProduto === 'brinde' && (
                  <div className="space-y-2">
                    <Label htmlFor="custoCompra">Custo de Compra (Última)</Label>
                    <Input
                      id="custoCompra"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.custoCompraUltima || ''}
                      onChange={(e) =>
                        handleFieldChange('custoCompraUltima', parseFloat(e.target.value) || 0)
                      }
                      placeholder="R$ 0,00"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="margemLucro">
                    Margem de Lucro Padrão (%) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="margemLucro"
                    type="number"
                    step="0.01"
                    min="0"
                    max="500"
                    value={formData.margemLucroPadrao}
                    onChange={(e) =>
                      handleFieldChange('margemLucroPadrao', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precoSugerido">Preço de Venda Sugerido</Label>
                  <Input
                    id="precoSugerido"
                    type="number"
                    value={formData.precoVendaSugerido?.toFixed(2) || '0.00'}
                    readOnly
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Calculado automaticamente
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precoPraticado">
                    Preço de Venda Praticado <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="precoPraticado"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precoVendaPraticado}
                    onChange={(e) =>
                      handleFieldChange('precoVendaPraticado', parseFloat(e.target.value) || 0)
                    }
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Custo Base:</span>
                  <span>
                    R${' '}
                    {formData.tipoProduto === 'brinde'
                      ? (formData.custoCompraUltima || 0).toFixed(2)
                      : (formData.custoProducao || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="font-medium">Margem:</span>
                  <span>{formData.margemLucroPadrao}%</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 border-t pt-2">
                  <span>Preço Sugerido:</span>
                  <span className="text-green-600">
                    R$ {formData.precoVendaSugerido?.toFixed(2) || '0,00'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate('/produtos')}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Produto</Button>
      </div>
    </form>
  );
};
