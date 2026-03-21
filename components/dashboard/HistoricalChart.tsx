"use client";

import { History, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AnaliseGeopoliticaDTO } from "@/types/geoMind";
import { cn } from "@/lib/utils";

interface HistoricalMatchProps {
  analise: AnaliseGeopoliticaDTO | null;
  loading?: boolean;
}

export function HistoricalChart({ analise, loading }: HistoricalMatchProps) {
  if (loading || !analise) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  const correlationPct = Math.round(analise.historical_correlation_score * 100);

  const badgeVariant =
    correlationPct >= 70 ? "rose" : correlationPct >= 40 ? "amber" : "emerald";

  const progressColor =
    correlationPct >= 70
      ? "bg-rose-500"
      : correlationPct >= 40
      ? "bg-amber-500"
      : "bg-emerald-500";

  const correlationLabel =
    correlationPct >= 70
      ? "Alta similaridade"
      : correlationPct >= 40
      ? "Similaridade moderada"
      : "Baixa similaridade";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-blue-400" />
            Rima Histórica
          </div>
        </CardTitle>
        <Badge variant={badgeVariant}>
          <TrendingUp className="h-3 w-3 mr-1" />
          {correlationPct}% similar
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Matched event */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
            Análogo histórico identificado
          </p>
          <p className="text-base font-bold text-slate-100">
            {analise.historical_event_match}
          </p>
        </div>

        {/* Correlation bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span
              className={cn(
                "font-medium",
                correlationPct >= 70
                  ? "text-rose-400"
                  : correlationPct >= 40
                  ? "text-amber-400"
                  : "text-emerald-400"
              )}
            >
              {correlationLabel}
            </span>
            <span className="text-slate-400 tabular-nums font-bold">
              {analise.historical_correlation_score.toFixed(2)}
            </span>
          </div>
          <Progress value={correlationPct} barClassName={progressColor} />
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Score calculado pelos agentes de IA comparando padrões estruturais,
          atores envolvidos e dinâmica de mercado com o evento histórico mais
          próximo.
        </p>
      </CardContent>
    </Card>
  );
}
