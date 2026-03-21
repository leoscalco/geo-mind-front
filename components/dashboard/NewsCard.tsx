"use client";

import { AlertTriangle, Clock, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnaliseGeopoliticaDTO, BrasiliaSentiment } from "@/types/geoMind";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  analise: AnaliseGeopoliticaDTO | null;
  loading?: boolean;
}

const sentimentConfig: Record<
  BrasiliaSentiment,
  { label: string; variant: "emerald" | "rose" | "amber" }
> = {
  Positivo: { label: "Positivo para Brasília", variant: "emerald" },
  Negativo: { label: "Negativo para Brasília", variant: "rose" },
  Neutro: { label: "Neutro para Brasília", variant: "amber" },
};

export function NewsCard({ analise, loading }: NewsCardProps) {
  if (loading || !analise) {
    return (
      <Card className="border-l-4 border-l-slate-600">
        <CardHeader>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5 mb-4" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  const sentiment = sentimentConfig[analise.brasilia_sentiment];

  return (
    <Card className="border-l-4 border-l-rose-500 group hover:border-l-rose-400 transition-colors">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            Resumo da Notícia
          </div>
        </CardTitle>
        <Badge variant={sentiment.variant}>{sentiment.label}</Badge>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-300 leading-relaxed">
          {analise.news_summary}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-3 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(analise.timestamp)}
          </span>
          {analise.tokens_utilizados && (
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {analise.tokens_utilizados.toLocaleString("pt-BR")} tokens
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
