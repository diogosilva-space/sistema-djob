import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const dataFaturamento = [
  { name: 'Jan', valor: 4000 },
  { name: 'Fev', valor: 3000 },
  { name: 'Mar', valor: 2000 },
  { name: 'Abr', valor: 2780 },
  { name: 'Mai', valor: 1890 },
  { name: 'Jun', valor: 2390 },
];

const dataOrcamentos = [
  { name: 'Jan', aprovados: 24, total: 40 },
  { name: 'Fev', aprovados: 18, total: 35 },
  { name: 'Mar', aprovados: 30, total: 45 },
  { name: 'Abr', aprovados: 20, total: 38 },
  { name: 'Mai', aprovados: 27, total: 50 },
  { name: 'Jun', aprovados: 25, total: 42 },
];

// ── Tooltip customizado ──
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card px-3 py-2 shadow-lg">
        <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-[11px] text-muted-foreground">
            <span
              className="mr-1.5 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name === 'valor'
              ? `R$ ${item.value.toLocaleString('pt-BR')}`
              : `${item.name}: ${item.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardCharts: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* ── Faturamento Mensal ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Faturamento Mensal</CardTitle>
          <CardDescription>Últimos 6 meses (R$)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataFaturamento}>
                <defs>
                  <linearGradient id="gradientFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#gradientFaturamento)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── Conversão de Orçamentos ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Conversão de Orçamentos</CardTitle>
          <CardDescription>Aprovados vs Total por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataOrcamentos} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="total"
                  fill="var(--chart-1)"
                  opacity={0.25}
                  radius={[4, 4, 0, 0]}
                  name="total"
                />
                <Bar
                  dataKey="aprovados"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                  name="aprovados"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
