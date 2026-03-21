"use client";

import { BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AnaliseGeopoliticaDTO } from "@/types/geoMind";

interface AnaliseDetalhadaProps {
  analise: AnaliseGeopoliticaDTO | null;
  loading?: boolean;
}

export function Playbook({ analise, loading }: AnaliseDetalhadaProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  const text = analise?.analise_detalhada;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            Análise Detalhada
          </div>
        </CardTitle>
        <Badge variant="amber">
          <Sparkles className="h-3 w-3 mr-1" />
          IA Gerada
        </Badge>
      </CardHeader>

      <CardContent>
        {!text ? (
          <p className="text-sm text-slate-500 text-center py-4">
            Nenhuma análise detalhada disponível.
          </p>
        ) : (
          <div className="prose-sm text-slate-300 leading-relaxed space-y-3">
            {text.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <p key={i} className="font-semibold text-slate-200">
                    {paragraph.replace(/\*\*/g, "")}
                  </p>
                );
              }

              if (paragraph.startsWith("**")) {
                const parts = paragraph.split(/\*\*(.*?)\*\*/g);
                return (
                  <p key={i} className="text-sm">
                    {parts.map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className="text-slate-200 font-semibold">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                );
              }

              if (paragraph.startsWith("- ")) {
                const items = paragraph
                  .split("\n")
                  .filter((l) => l.startsWith("- "))
                  .map((l) => l.slice(2));
                return (
                  <ul key={i} className="space-y-1 text-sm pl-3">
                    {items.map((item, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-emerald-500 mt-0.5">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={i} className="text-sm">
                  {paragraph}
                </p>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
