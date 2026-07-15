import type { DashboardSummary } from '@djob/validators';
import { AlertCircle, ChevronRight, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardAlertsProps {
  alerts: DashboardSummary['alerts'];
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold">Alertas operacionais</CardTitle>
        <CardDescription>Itens que exigem acompanhamento</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {alerts.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">
            Nenhum alerta operacional no momento.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {alerts.map((alert) => {
              const Icon = alert.severity === 'critical' ? AlertCircle : TriangleAlert;
              const iconClassName =
                alert.severity === 'critical' ? 'text-destructive' : 'text-warning';

              return (
                <Link
                  key={alert.id}
                  href={alert.href}
                  className="flex items-center gap-3 py-3 first:pt-1 last:pb-1 hover:text-foreground"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${iconClassName}`} strokeWidth={1.5} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{alert.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
