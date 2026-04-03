"use client";

import { AlertTriangle, Clock, Cpu, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NoticiaAnaliseDTO, SentimentoPolitico } from "@/types/geoMind";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  analise: NoticiaAnaliseDTO | null;
  loading?: boolean;
}

const sentimentConfig: Record<
  SentimentoPolitico,
  { label: string; variant: "emerald" | "rose" | "amber" }
> = {
  positivo: { label: "Positivo para Brasil", variant: "emerald" },
  negativo: { label: "Negativo para Brasil", variant: "rose" },
  neutro: { label: "Neutro para Brasil", variant: "amber" },
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

  const sentimentoBrasil = analise.analise_macro?.sentimento_brasil ?? "neutro";
  const sentiment = sentimentConfig[sentimentoBrasil];

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
        {analise.resumo_executivo ? (
          <p className="text-sm text-slate-300 leading-relaxed">{analise.resumo_executivo}</p>
        ) : (
          <p className="text-sm text-slate-300 leading-relaxed">{analise.resumo}</p>
        )}

        {analise.por_que_aconteceu && (
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Por que aconteceu</p>
            <p className="text-xs text-slate-300 leading-relaxed">{analise.por_que_aconteceu}</p>
          </div>
        )}

        {analise.o_que_fazer && (
          <div className="mt-2 rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-2.5">
            <p className="text-xs text-emerald-500 uppercase tracking-wider mb-1">O que fazer</p>
            <p className="text-xs text-slate-300 leading-relaxed">{analise.o_que_fazer}</p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-3 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(analise.gerado_em)}
          </span>
          {analise.tokens_utilizados > 0 && (
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {analise.tokens_utilizados.toLocaleString("pt-BR")} tokens
            </span>
          )}
          {analise.fonte && <span className="text-slate-600">{analise.fonte}</span>}
          {analise.url && (
            <a
              href={analise.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-400"
            >
              <ExternalLink className="h-3 w-3" />
              Ver original
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
