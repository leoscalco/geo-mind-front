"use client";

import { AlertTriangle, ArrowUpRight, Clock, Globe, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsSummary } from "@/types/geoMind";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  news: NewsSummary | null;
  loading?: boolean;
}

const sentimentConfig = {
  POSITIVE: { label: "Positivo", variant: "emerald" as const },
  NEGATIVE: { label: "Negativo", variant: "rose" as const },
  NEUTRAL: { label: "Neutro", variant: "slate" as const },
};

const impactColor = (score: number) => {
  if (score >= 75) return "text-rose-400";
  if (score >= 50) return "text-amber-400";
  return "text-emerald-400";
};

export function NewsCard({ news, loading }: NewsCardProps) {
  if (loading || !news) {
    return (
      <Card className="border-l-4 border-l-slate-600">
        <CardHeader>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-4/5 mb-4" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  const sentiment = sentimentConfig[news.sentiment];

  return (
    <Card className="border-l-4 border-l-rose-500 group hover:border-l-rose-400 transition-colors">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            Notícia Ativa
          </div>
        </CardTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={sentiment.variant}>{sentiment.label}</Badge>
          <Badge variant="slate">
            <Globe className="h-3 w-3 mr-1" />
            {news.region}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <h2 className="text-lg font-bold text-slate-100 mb-2 leading-tight group-hover:text-white transition-colors">
          {news.title}
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          {news.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              {news.source}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(news.published_at)}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {news.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-slate-500">Impacto estimado:</span>
          <span className={`text-sm font-bold ${impactColor(news.impact_score)}`}>
            {news.impact_score}/100
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
