"use client";

import { BookOpen, Globe, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { NoticiaAnaliseDTO } from "@/types/geoMind";
import { MiroFishPanel } from "./MiroFishPanel";

interface PlaybookProps {
  analise: NoticiaAnaliseDTO | null;
  loading?: boolean;
}

function TextBlock({ text }: { text: string }) {
  return (
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
  );
}

export function Playbook({ analise, loading }: PlaybookProps) {
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

  const macro = analise?.analise_macro;
  const geopolitica = analise?.analise_geopolitica;
  const text = macro?.analise_detalhada;

  return (
    <div className="space-y-4">
      {/* Macro analysis */}
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
            <TextBlock text={text} />
          )}
        </CardContent>
      </Card>

      {/* Geopolitical perspectives */}
      {geopolitica && geopolitica.perspectivas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                Perspectivas Geopolíticas
              </div>
            </CardTitle>
            <p className="text-xs text-slate-500">{geopolitica.tensao_global}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {geopolitica.perspectivas.map((p, i) => (
              <div key={i} className="rounded-lg border border-slate-800 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200">{p.pais}</span>
                  <Badge
                    variant={
                      p.sentimento === "positivo"
                        ? "emerald"
                        : p.sentimento === "negativo"
                        ? "rose"
                        : "amber"
                    }
                  >
                    {p.sentimento}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{p.posicao}</p>
                <p className="text-xs text-slate-300">{p.impacto_esperado}</p>
                <p className="text-xs text-slate-500 italic">{p.acoes_provaveis}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* MiroFish simulation */}
      {analise && <MiroFishPanel noticiaId={analise.id} />}
    </div>
  );
}
