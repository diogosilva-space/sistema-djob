'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Lock } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Produtos e Matérias-Primas</h1>
        <p className="text-muted-foreground">
          Gestão de produtos acabados, serviços e grade de insumos
        </p>
      </div>

      <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
        <CardHeader className="flex flex-col items-center">
          <div className="p-3 bg-slate-100 rounded-full mb-4">
            <Package className="h-8 w-8 text-slate-500" />
          </div>
          <CardTitle className="text-xl">Catálogo de Produtos</CardTitle>
          <CardDescription className="max-w-md mt-2">
            Este módulo permite cadastrar os produtos da confecção, fichas técnicas (BOM) e suas
            respectivas grades de cores e tamanhos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-md p-3 gap-2">
          <Lock className="h-4 w-4 text-amber-600" />
          <span>
            A integração com o Estoque e PCP será ativada na próxima fase de desenvolvimento.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
