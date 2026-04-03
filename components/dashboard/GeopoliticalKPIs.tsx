"use client";

import { Activity, Brain, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { NoticiaAnaliseDTO, SentimentoMercado, SentimentoPolitico } from "@/types/geoMind";
import { cn } from "@/lib/utils";

interface GeopoliticalKPIsProps {
  analise: NoticiaAnaliseDTO | null;
  loading?: boolean;
}

const forecastConfig: Record<
  SentimentoMercado,
  { label: string; variant: "emerald" | "rose" | "slate"; icon: React.ReactNode }
> = {
  bull: {
    label: "Mercado Altista",
    variant: "emerald",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
  },
  bear: {
    label: "Mercado Baixista",
    variant: "rose",
    icon: <TrendingDown className="h-3.5 w-3.5" />,
  },
  neutro: {
    label: "Mercado Neutro",
    variant: "slate",
    icon: <Minus className="h-3.5 w-3.5" />,
  },
};

const sentimentConfig: Record<
  SentimentoPolitico,
  { variant: "emerald" | "rose" | "amber" }
> = {
  positivo: { variant: "emerald" },
  negativo: { variant: "rose" },
  neutro: { variant: "amber" },
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function CorrelationGauge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference * (1 - score);
  const color = pct >= 70 ? "#f43f5e" : pct >= 40 ? "#f59e0b" : "#10b981";

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      <div className="relative flex items-center justify-center">
        <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
          <circle cx="45" cy="45" r="36" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="45"
            cy="45"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <span className="absolute text-xl font-black tabular-nums" style={{ color }}>
          {pct}%
        </span>
      </div>
      <p className="text-xs text-slate-400 text-center">Correlação Histórica</p>
    </div>
  );
}

export function GeopoliticalKPIs({ analise, loading }: GeopoliticalKPIsProps) {
  if (loading || !analise) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const macro = analise.analise_macro;
  const historico = analise.analise_historica;

  const sentimentoMercado = macro?.sentimento_mercado ?? "neutro";
  const sentimentoBrasil = macro?.sentimento_brasil ?? "neutro";
  const score = historico?.score_correlacao ?? 0;

  const forecast = forecastConfig[sentimentoMercado];
  const sentiment = sentimentConfig[sentimentoBrasil];
  const correlationPct = Math.round(score * 100);

  const progressColor =
    correlationPct >= 70 ? "bg-rose-500" : correlationPct >= 40 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-400" />
            Análise de Risco
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {historico && <CorrelationGauge score={score} />}

        <div className="border-t border-slate-800 pt-4 space-y-3">
          {macro && (
            <>
              {/* Market Impact */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Impacto nos Mercados</span>
                <Badge variant={forecast.variant}>
                  {forecast.icon}
                  <span className="ml-1">{forecast.label}</span>
                </Badge>
              </div>

              {/* Brasil Sentiment */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs text-slate-400">Sentimento Brasil</span>
                </div>
                <Badge variant={sentiment.variant}>{capitalize(sentimentoBrasil)}</Badge>
              </div>
            </>
          )}

          {/* Correlation bar */}
          {historico && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Score de correlação</span>
                <span
                  className={cn(
                    "font-bold tabular-nums",
                    correlationPct >= 70
                      ? "text-rose-400"
                      : correlationPct >= 40
                      ? "text-amber-400"
                      : "text-emerald-400"
                  )}
                >
                  {correlationPct}/100
                </span>
              </div>
              <Progress value={correlationPct} barClassName={progressColor} />
              <p className="text-xs text-slate-500">
                Similaridade com evento histórico análogo
              </p>
            </div>
          )}
        </div>

        {/* Previsões de ativos */}
        {macro && macro.previsoes_ativos.length > 0 && (
          <div className="border-t border-slate-800 pt-3 space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Previsões</p>
            {macro.previsoes_ativos.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{p.ativo}</span>
                <span
                  className={cn(
                    "font-semibold",
                    p.direcao === "bull"
                      ? "text-emerald-400"
                      : p.direcao === "bear"
                      ? "text-rose-400"
                      : "text-slate-400"
                  )}
                >
                  {p.magnitude_esperada}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
