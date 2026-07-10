import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Tag, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useCliente } from '@/features/crm/hooks/useClientes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ClienteDetalhesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cliente, isLoading } = useCliente(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">Carregando cliente...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Aguarde enquanto buscamos os dados
          </div>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">Cliente não encontrado</div>
          <div className="text-sm text-muted-foreground mt-2">
            O cliente solicitado não existe ou foi removido
          </div>
          <Button onClick={() => navigate('/crm')} className="mt-4">
            Voltar para CRM
          </Button>
        </div>
      </div>
    );
  }

  const enderecoEntrega = cliente.enderecos?.find(
    (e) => e.tipo === 'Entrega' || e.tipo === 'Ambos'
  );
  const enderecoFaturamento = cliente.enderecos?.find(
    (e) => e.tipo === 'Faturamento' || e.tipo === 'Ambos'
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/crm')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {cliente.razaoSocial}
            </h1>
            {cliente.nomeFantasia && (
              <p className="text-muted-foreground mt-1">
                {cliente.nomeFantasia}
              </p>
            )}
          </div>
          <Badge variant={cliente.ativo ? 'default' : 'secondary'}>
            {cliente.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
          <Badge variant="outline">
            {cliente.tipoPessoa === 'juridica' ? 'Pessoa Jurídica' : 'Pessoa Física'}
          </Badge>
        </div>
        <Button onClick={() => navigate(`/crm/clientes/${id}/editar`)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar Cliente
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPF/CNPJ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono">{cliente.cpfCnpj}</div>
            {cliente.inscricaoEstadual && (
              <p className="text-xs text-muted-foreground mt-1">
                IE: {cliente.inscricaoEstadual}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segmento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{cliente.segmento}</div>
            {cliente.origem && (
              <p className="text-xs text-muted-foreground mt-1">
                Origem: {cliente.origem}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Limite de Crédito</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {cliente.limiteCredito
                ? `R$ ${cliente.limiteCredito.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}`
                : 'Não definido'}
            </div>
            {cliente.condicaoPagamentoPadrao && (
              <p className="text-xs text-muted-foreground mt-1">
                {cliente.condicaoPagamentoPadrao}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliente desde</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {format(new Date(cliente.dataCadastro), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.floor(
                (new Date().getTime() - new Date(cliente.dataCadastro).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{' '}
              dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Abas de Detalhes */}
      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="enderecos">Endereços</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Aba: Informações Gerais */}
        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Cadastrais</CardTitle>
              <CardDescription>
                Informações principais do cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tipo de Pessoa
                  </label>
                  <p className="text-base">
                    {cliente.tipoPessoa === 'juridica'
                      ? 'Pessoa Jurídica'
                      : 'Pessoa Física'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Segmento
                  </label>
                  <p className="text-base">{cliente.segmento}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Origem
                  </label>
                  <p className="text-base">{cliente.origem || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Vendedor Responsável
                  </label>
                  <p className="text-base">
                    {cliente.vendedorResponsavel || 'Não definido'}
                  </p>
                </div>
              </div>

              {cliente.tags && cliente.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cliente.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {cliente.observacoes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Observações
                  </label>
                  <p className="text-base mt-1 whitespace-pre-wrap">
                    {cliente.observacoes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Comerciais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Limite de Crédito
                  </label>
                  <p className="text-base">
                    {cliente.limiteCredito
                      ? `R$ ${cliente.limiteCredito.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}`
                      : 'Não definido'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Condição de Pagamento
                  </label>
                  <p className="text-base">
                    {cliente.condicaoPagamentoPadrao || 'Não definido'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tabela de Preço
                  </label>
                  <p className="text-base">
                    {cliente.tabelaPreco || 'Padrão'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Contatos */}
        <TabsContent value="contatos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Telefones, e-mails e redes sociais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {cliente.telefonePrincipal && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Telefone Principal
                      </label>
                      <p className="text-base font-mono">
                        {cliente.telefonePrincipal}
                      </p>
                    </div>
                  </div>
                )}

                {cliente.whatsapp && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        WhatsApp
                      </label>
                      <p className="text-base font-mono">{cliente.whatsapp}</p>
                    </div>
                  </div>
                )}

                {cliente.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        E-mail
                      </label>
                      <p className="text-base">{cliente.email}</p>
                    </div>
                  </div>
                )}

                {cliente.site && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Site
                      </label>
                      <a
                        href={cliente.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-primary hover:underline"
                      >
                        {cliente.site}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {(cliente.contatoPrincipal || cliente.cargoContato) && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium mb-3">Pessoa de Contato</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {cliente.contatoPrincipal && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Nome
                        </label>
                        <p className="text-base">{cliente.contatoPrincipal}</p>
                      </div>
                    )}
                    {cliente.cargoContato && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Cargo
                        </label>
                        <p className="text-base">{cliente.cargoContato}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Endereços */}
        <TabsContent value="enderecos" className="space-y-4">
          {enderecoFaturamento && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Endereço de Faturamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  {enderecoFaturamento.logradouro}, {enderecoFaturamento.numero}
                  {enderecoFaturamento.complemento &&
                    ` - ${enderecoFaturamento.complemento}`}
                </p>
                <p className="text-base">
                  {enderecoFaturamento.bairro} - {enderecoFaturamento.cidade}/
                  {enderecoFaturamento.estado}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  CEP: {enderecoFaturamento.cep}
                </p>
              </CardContent>
            </Card>
          )}

          {enderecoEntrega && enderecoEntrega !== enderecoFaturamento && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  {enderecoEntrega.logradouro}, {enderecoEntrega.numero}
                  {enderecoEntrega.complemento &&
                    ` - ${enderecoEntrega.complemento}`}
                </p>
                <p className="text-base">
                  {enderecoEntrega.bairro} - {enderecoEntrega.cidade}/
                  {enderecoEntrega.estado}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  CEP: {enderecoEntrega.cep}
                </p>
              </CardContent>
            </Card>
          )}

          {(!enderecoFaturamento && !enderecoEntrega) && (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  Nenhum endereço cadastrado
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Aba: Histórico */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Interações</CardTitle>
              <CardDescription>
                Registros de contatos e atividades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Histórico de interações</p>
                  <p className="text-sm mt-1">
                    Funcionalidade em desenvolvimento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
