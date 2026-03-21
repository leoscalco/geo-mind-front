"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Lock,
  Shield,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaybookRecommendation } from "@/types/geoMind";
import { cn } from "@/lib/utils";

interface PlaybookProps {
  recommendations: PlaybookRecommendation[];
  loading?: boolean;
  isPremium?: boolean;
}

const actionConfig = {
  BUY: {
    label: "Comprar",
    icon: <ArrowUp className="h-3 w-3" />,
    variant: "emerald" as const,
  },
  SELL: {
    label: "Vender",
    icon: <ArrowDown className="h-3 w-3" />,
    variant: "rose" as const,
  },
  HOLD: {
    label: "Manter",
    icon: <ArrowRight className="h-3 w-3" />,
    variant: "amber" as const,
  },
  HEDGE: {
    label: "Hedge",
    icon: <Shield className="h-3 w-3" />,
    variant: "blue" as const,
  },
};

const riskConfig = {
  LOW: { label: "Risco Baixo", className: "text-emerald-400" },
  MEDIUM: { label: "Risco Médio", className: "text-amber-400" },
  HIGH: { label: "Risco Alto", className: "text-rose-400" },
};

interface PlaybookItemProps {
  rec: PlaybookRecommendation;
  index: number;
  blurred?: boolean;
}

function PlaybookItem({ rec, index, blurred }: PlaybookItemProps) {
  const action = actionConfig[rec.action];
  const risk = riskConfig[rec.risk_level];

  return (
    <div
      className={cn(
        "relative rounded-lg border border-slate-800 bg-slate-950/50 p-3 transition-all",
        "hover:border-slate-700 hover:bg-slate-900/50",
        blurred && "select-none"
      )}
    >
      {blurred && (
        <div className="absolute inset-0 rounded-lg backdrop-blur-sm bg-slate-950/60 flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Lock className="h-4 w-4" />
            Premium
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-sm font-bold text-slate-100">{rec.asset}</span>
            <Badge variant={action.variant}>
              {action.icon}
              <span className="ml-1">{action.label}</span>
            </Badge>
            <span className={cn("text-xs", risk.className)}>{risk.label}</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">{rec.rationale}</p>

          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
            <span>Horizonte: <span className="text-slate-300">{rec.time_horizon}</span></span>
            <span>Confiança: <span className="text-slate-300 font-medium">{rec.confidence}%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Playbook({ recommendations, loading, isPremium = true }: PlaybookProps) {
  const FREE_LIMIT = 2;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
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
            <Sparkles className="h-4 w-4 text-amber-400" />
            Playbook Estratégico
          </div>
        </CardTitle>
        <Badge variant="amber">
          <Sparkles className="h-3 w-3 mr-1" />
          IA Gerada
        </Badge>
      </CardHeader>

      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            Aguardando análise para gerar recomendações...
          </p>
        ) : (
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <PlaybookItem
                key={rec.id}
                rec={rec}
                index={i}
                blurred={!isPremium && i >= FREE_LIMIT}
              />
            ))}

            {!isPremium && recommendations.length > FREE_LIMIT && (
              <p className="text-xs text-slate-500 text-center pt-1">
                Desbloqueie todas as {recommendations.length} recomendações com o plano Premium.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
