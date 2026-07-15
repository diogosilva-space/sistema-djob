import React, { useState } from 'react';
import {
  ChevronLeft,
  Save,
  User,
  Contact,
  FileCheck,
  Briefcase,
  Landmark,
  Users,
  Camera,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export const FuncionarioNovoPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dados-pessoais');

  const handleSave = () => {
    alert('Funcionário cadastrado com sucesso!');
    navigate('/rh');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigate('/rh')}>
            <ChevronLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Novo Funcionário</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Cadastre um novo colaborador no sistema
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/rh')}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            Salvar Cadastro
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 w-full justify-start overflow-x-auto h-auto min-h-[44px]">
          <TabsTrigger value="dados-pessoais" className="gap-2 text-xs py-2 px-4 h-9">
            <User size={14} /> Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="contato" className="gap-2 text-xs py-2 px-4 h-9">
            <Contact size={14} /> Contato e Endereço
          </TabsTrigger>
          <TabsTrigger value="documentacao" className="gap-2 text-xs py-2 px-4 h-9">
            <FileCheck size={14} /> Documentação
          </TabsTrigger>
          <TabsTrigger value="contratual" className="gap-2 text-xs py-2 px-4 h-9">
            <Briefcase size={14} /> Dados Contratuais
          </TabsTrigger>
          <TabsTrigger value="bancario" className="gap-2 text-xs py-2 px-4 h-9">
            <Landmark size={14} /> Dados Bancários
          </TabsTrigger>
          <TabsTrigger value="dependentes" className="gap-2 text-xs py-2 px-4 h-9">
            <Users size={14} /> Dependentes
          </TabsTrigger>
        </TabsList>

        <Card className="shadow-sm border-muted/40">
          <CardContent className="pt-6">
            <TabsContent value="dados-pessoais" className="mt-0 space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30 relative overflow-hidden group">
                    <Camera
                      size={32}
                      className="text-muted-foreground group-hover:scale-110 transition-transform"
                    />
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase">
                    Foto 3x4
                  </span>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" placeholder="Digite o nome completo" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataNasc">Data de Nascimento</Label>
                    <Input id="dataNasc" type="date" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                    <Select>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        <SelectItem value="uniao">União Estável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="naturalidade">Naturalidade (Cidade)</Label>
                    <Input
                      id="naturalidade"
                      placeholder="Cidade onde nasceu"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ufNat">UF</Label>
                    <Input id="ufNat" className="h-9 text-sm" maxLength={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pai">Nome do Pai</Label>
                    <Input id="pai" placeholder="Nome do pai" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mae">Nome da Mãe</Label>
                    <Input id="mae" placeholder="Nome da mãe" className="h-9 text-sm" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contato" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="00000-000" className="h-9 text-sm" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="logradouro">Endereço (Logradouro)</Label>
                  <Input id="logradouro" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input id="complemento" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input id="bairro" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Input id="uf" className="h-9 text-sm" maxLength={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular / WhatsApp</Label>
                  <Input id="celular" placeholder="(00) 00000-0000" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telFixo">Telefone Fixo</Label>
                  <Input id="telFixo" placeholder="(00) 0000-0000" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telRecado">Telefone para Recados</Label>
                  <Input id="telRecado" placeholder="(00) 00000-0000" className="h-9 text-sm" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documentacao" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input id="rg" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgaoExp">Órgão Expedidor</Label>
                  <Input id="orgaoExp" className="h-9 text-sm" />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="pis">PIS/PASEP</Label>
                  <Input id="pis" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctps">CTPS (Nº Carteira)</Label>
                  <Input id="ctps" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serieCtps">Série CTPS</Label>
                  <Input id="serieCtps" className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titEleitor">Título de Eleitor</Label>
                  <Input id="titEleitor" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zona">Zona</Label>
                  <Input id="zona" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secao">Seção</Label>
                  <Input id="secao" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reservista">Carteira Reservista</Label>
                  <Input id="reservista" className="h-9 text-sm" />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="cnh">CNH (Nº Registro)</Label>
                  <Input id="cnh" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catCnh">Categoria CNH</Label>
                  <Select>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valCnh">Validade CNH</Label>
                  <Input id="valCnh" type="date" className="h-9 text-sm" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contratual" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="admissao">Data de Admissão</Label>
                  <Input id="admissao" type="date" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Função/Cargo</Label>
                  <Select>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                      <SelectItem value="costureira">Costureira</SelectItem>
                      <SelectItem value="aux-producao">Aux. Produção</SelectItem>
                      <SelectItem value="financeiro">Analista Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salario">Salário Base (R$)</Label>
                  <Input id="salario" type="number" step="0.01" className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaM">Horário Manhã</Label>
                  <Input id="horaM" placeholder="Ex: 08:00 às 12:00" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaT">Horário Tarde</Label>
                  <Input id="horaT" placeholder="Ex: 14:00 às 18:00" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descanso">Descanso Semanal</Label>
                  <Input id="descanso" placeholder="Ex: Sábado e Domingo" className="h-9 text-sm" />
                </div>

                <div className="flex flex-col gap-4 border p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-bold">Desconto VT</Label>
                      <p className="text-[11px] text-muted-foreground">
                        Optante pelo Vale Transporte
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-bold">Seguro Desemprego</Label>
                      <p className="text-[11px] text-muted-foreground">Recebe seguro atualmente?</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bancario" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banco">Banco</Label>
                  <Select>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="itau">Itaú Unibanco</SelectItem>
                      <SelectItem value="bradesco">Bradesco</SelectItem>
                      <SelectItem value="santander">Santander</SelectItem>
                      <SelectItem value="bb">Banco do Brasil</SelectItem>
                      <SelectItem value="caixa">Caixa Econômica</SelectItem>
                      <SelectItem value="nubank">Nubank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agencia">Agência</Label>
                  <Input id="agencia" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conta">Conta Corrente / Poupança</Label>
                  <Input id="conta" className="h-9 text-sm" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dependentes" className="mt-0 space-y-6">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2 text-[11px] font-bold">
                  <Plus size={14} /> Adicionar Dependente
                </Button>
              </div>

              <div className="border rounded-md">
                <div className="p-8 text-center text-muted-foreground text-xs">
                  <Users size={24} className="mx-auto mb-2 opacity-20" />
                  Nenhum dependente cadastrado ainda.
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/rh')}>
          Cancelar
        </Button>
        <Button onClick={handleSave} className="gap-2 font-bold h-10 px-6">
          <Save size={18} />
          Salvar Cadastro do Funcionário
        </Button>
      </div>
    </div>
  );
};
