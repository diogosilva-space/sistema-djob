'use client';

import { useState, useEffect } from 'react';
import { vendasService } from '@/features/vendas/api/vendas.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, ArrowRight, FileText, CheckCircle, Clock, AlertTriangle, Repeat } from 'lucide-react';
import Link from 'next/link';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await vendasService.getQuotes();
      setQuotes(data);
    } catch (error) {
      console.error('Erro ao buscar orçamentos', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            <Clock className="h-3 w-3" />
            <span>Rascunho</span>
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <Repeat className="h-3 w-3" />
            <span>Enviado</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="h-3 w-3" />
            <span>Aprovado</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
            <AlertTriangle className="h-3 w-3" />
            <span>Rejeitado</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
            <AlertTriangle className="h-3 w-3" />
            <span>Expirado</span>
          </span>
        );
      case 'CONVERTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            <CheckCircle className="h-3 w-3" />
            <span>Convertido</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            <span>{status}</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={FileText}
        title="Orçamentos"
        subtitle="Gestão e acompanhamento de propostas comerciais"
      >
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
      </PageActionHeader>

      {quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border border-border rounded-lg bg-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-muted-foreground">Nenhum orçamento registrado.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => (
            <Card
              key={quote.id}
              className="bg-card rounded-lg border border-border shadow-sm hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">{quote.code}</CardTitle>
                    <div className="text-lg tabular-nums font-bold text-foreground mt-1">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(quote.totalAmount || 0)}
                    </div>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-sm space-y-2 border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="font-semibold text-foreground truncate max-w-[170px]">
                      {quote.customer?.name || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Envio:</span>
                    <span className="font-medium text-foreground">
                      {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-foreground hover:text-foreground hover:bg-muted font-semibold active:scale-[0.97] transition-all flex items-center gap-1"
                    >
                      <span>Gerenciar</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
