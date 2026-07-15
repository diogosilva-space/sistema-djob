'use client';

import { useState, useEffect } from 'react';
import { vendasService } from '@/features/vendas/api/vendas.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, ArrowRight, FileText, CheckCircle, Clock, AlertTriangle, Repeat } from 'lucide-react';
import Link from 'next/link';

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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="h-3 w-3" />
            <span>Rascunho</span>
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            <Repeat className="h-3 w-3" />
            <span>Enviado</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="h-3 w-3" />
            <span>Aprovado</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
            <AlertTriangle className="h-3 w-3" />
            <span>Rejeitado</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            <AlertTriangle className="h-3 w-3" />
            <span>Expirado</span>
          </span>
        );
      case 'CONVERTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <CheckCircle className="h-3 w-3" />
            <span>Convertido</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Orçamentos</h1>
            <p className="text-sm text-slate-500">Gestão e acompanhamento de propostas comerciais</p>
          </div>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 active:scale-[0.98] transition-transform">
          <Plus className="h-4 w-4" />
          <span>Novo Orçamento</span>
        </Button>
      </div>

      {quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <FileText className="h-12 w-12 text-slate-350 mb-4" />
          <p className="text-slate-500 font-medium mb-4">Nenhum orçamento registrado.</p>
          <Button variant="outline" className="border-slate-200 hover:bg-slate-100">
            Criar Primeiro Orçamento
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => (
            <Card
              key={quote.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-extrabold text-slate-900">{quote.code}</CardTitle>
                    <div className="text-lg font-mono font-bold text-slate-950 mt-1">
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
                <div className="text-sm space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-455">Cliente:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                      {quote.customer?.name || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-455">Data de Envio:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold active:scale-[0.97] transition-all flex items-center gap-1"
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
