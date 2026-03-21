"use client";

import { Activity, Brain, Globe, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { GeopoliticalIndicators } from "@/types/geoMind";
import { cn } from "@/lib/utils";

interface GeopoliticalKPIsProps {
  indicators: GeopoliticalIndicators | null;
  similarityScore?: number;
  loading?: boolean;
}

function scoreColor(score: number, invert = false): string {
  const high = invert ? score <= 30 : score >= 70;
  const medium = score >= 40 && score <= 70;

  if (high) return "text-rose-400";
  if (medium) return "text-amber-400";
  return "text-emerald-400";
}

function progressBarColor(score: number, invert = false): string {
  const high = invert ? score <= 30 : score >= 70;
  const medium = score >= 40 && score <= 70;

  if (high) return "bg-rose-500";
  if (medium) return "bg-amber-500";
  return "bg-emerald-500";
}

interface KPIRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  invert?: boolean;
}

function KPIRow({ icon, label, value, description, invert = false }: KPIRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-slate-300 font-medium">{label}</span>
        </div>
        <span className={cn("text-lg font-bold tabular-nums", scoreColor(value, invert))}>
          {value}
          <span className="text-xs text-slate-500 font-normal ml-0.5">/100</span>
        </span>
      </div>
      <Progress
        value={value}
        barClassName={progressBarColor(value, invert)}
      />
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}

function SimilarityGauge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference * (1 - score);

  const color =
    pct >= 70 ? "#f43f5e" : pct >= 40 ? "#f59e0b" : "#10b981";

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
        <span
          className="absolute text-xl font-black tabular-nums"
          style={{ color }}
        >
          {pct}%
        </span>
      </div>
      <p className="text-xs text-slate-400 text-center">Score de Similaridade Histórica</p>
    </div>
  );
}

export function GeopoliticalKPIs({
  indicators,
  similarityScore = 0,
  loading,
}: GeopoliticalKPIsProps) {
  if (loading || !indicators) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-400" />
            KPIs Geopolíticos
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <SimilarityGauge score={similarityScore} />

        <div className="border-t border-slate-800 pt-4 space-y-5">
          <KPIRow
            icon={<Shield className="h-4 w-4 text-rose-400" />}
            label="Risco Brasil"
            value={indicators.brasil_risk_score}
            description="Índice composto de instabilidade política, fiscal e externa"
            invert={false}
          />

          <KPIRow
            icon={<Activity className="h-4 w-4 text-amber-400" />}
            label="Sentimento de Brasília"
            value={indicators.brasilia_sentiment}
            description="Pulso político da capital — baseado em NLP de discursos e press releases"
            invert={false}
          />

          <KPIRow
            icon={<Globe className="h-4 w-4 text-blue-400" />}
            label="Incerteza Global"
            value={indicators.global_uncertainty_index}
            description="Derivado do VIX geopolítico e índice de tensão de rotas comerciais"
            invert={false}
          />

          <KPIRow
            icon={<Zap className="h-4 w-4 text-emerald-400" />}
            label="Segurança Energética"
            value={indicators.energy_security_score}
            description="Score de diversificação e estabilidade de fornecimento de energia"
            invert={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}
