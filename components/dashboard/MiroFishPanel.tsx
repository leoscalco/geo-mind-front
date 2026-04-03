"use client";

import { useEffect, useRef, useState } from "react";
import { Brain, ChevronDown, ChevronUp, Loader2, Play, RotateCcw, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  SimulacaoRelatorioDTO,
  SimulacaoStatusDTO,
  StatusSimulacao,
} from "@/types/geoMind";
import {
  getSimulacaoRelatorio,
  getSimulacaoStatus,
  iniciarSimulacao,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface MiroFishPanelProps {
  noticiaId: string;
}

const STATUS_LABELS: Record<StatusSimulacao, string> = {
  pendente: "Aguardando início…",
  gerando_grafo: "Construindo knowledge graph…",
  preparando: "Gerando perfis de agentes…",
  simulando: "Simulando interações sociais…",
  gerando_relatorio: "Gerando relatório de predição…",
  concluido: "Simulação concluída",
  falhou: "Simulação falhou",
};

const STATUS_PROGRESSO_ESTIMADO: Record<StatusSimulacao, number> = {
  pendente: 5,
  gerando_grafo: 15,
  preparando: 35,
  simulando: 60,
  gerando_relatorio: 85,
  concluido: 100,
  falhou: 0,
};

function MarkdownSimples({ texto }: { texto: string }) {
  // Renderização simples de markdown sem dependências externas
  const linhas = texto.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < linhas.length) {
    const linha = linhas[i];
    if (linha.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-base font-bold text-slate-100 mt-4 mb-1">
          {linha.slice(3)}
        </h2>
      );
    } else if (linha.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-lg font-black text-slate-100 mt-2 mb-2">
          {linha.slice(2)}
        </h1>
      );
    } else if (linha.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-sm font-semibold text-slate-200 mt-3 mb-0.5">
          {linha.slice(4)}
        </h3>
      );
    } else if (linha.startsWith("- ")) {
      elements.push(
        <li key={i} className="flex gap-2 text-xs text-slate-300 ml-2">
          <span className="text-emerald-500 flex-shrink-0 mt-0.5">›</span>
          <span>{linha.slice(2)}</span>
        </li>
      );
    } else if (linha.trim() === "") {
      elements.push(<div key={i} className="h-1" />);
    } else {
      elements.push(
        <p key={i} className="text-xs text-slate-300 leading-relaxed">
          {linha}
        </p>
      );
    }
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function RelatorioView({ relatorio }: { relatorio: SimulacaoRelatorioDTO }) {
  const [expandido, setExpandido] = useState(false);
  const secoes = relatorio.relatorio_markdown.split(/^## /m).filter(Boolean);
  const preview = secoes[0] ?? relatorio.relatorio_markdown.slice(0, 800);
  const resto = secoes.slice(1);

  return (
    <div className="space-y-3">
      {/* Métricas */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-0.5">
            <Users className="h-3 w-3" />
            Agentes
          </div>
          <p className="text-lg font-black text-emerald-400">{relatorio.agentes_count}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-0.5">
            <Zap className="h-3 w-3" />
            Rounds
          </div>
          <p className="text-lg font-black text-blue-400">{relatorio.rounds_completados}</p>
        </div>
      </div>

      {/* Preview do relatório */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 max-h-64 overflow-y-auto">
        <MarkdownSimples texto={preview} />
      </div>

      {/* Demais seções colapsáveis */}
      {resto.length > 0 && (
        <>
          <button
            onClick={() => setExpandido((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
          >
            {expandido ? (
              <>
                <ChevronUp className="h-3 w-3" /> Recolher relatório
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Ver relatório completo ({resto.length} seções)
              </>
            )}
          </button>

          {expandido && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 max-h-96 overflow-y-auto space-y-2">
              {resto.map((secao, i) => (
                <MarkdownSimples key={i} texto={`## ${secao}`} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function MiroFishPanel({ noticiaId }: MiroFishPanelProps) {
  const [simulacaoId, setSimulacaoId] = useState<string | null>(null);
  const [status, setStatus] = useState<SimulacaoStatusDTO | null>(null);
  const [relatorio, setRelatorio] = useState<SimulacaoRelatorioDTO | null>(null);
  const [iniciando, setIniciando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Inicia polling quando há simulacaoId
  useEffect(() => {
    if (!simulacaoId) return;

    const poll = async () => {
      try {
        const s = await getSimulacaoStatus(simulacaoId);
        setStatus(s);

        if (s.status === "concluido") {
          clearInterval(intervalRef.current!);
          const r = await getSimulacaoRelatorio(simulacaoId);
          setRelatorio(r);
        } else if (s.status === "falhou") {
          clearInterval(intervalRef.current!);
          setErro(s.erro ?? "Erro desconhecido na simulação.");
        }
      } catch {
        // ignora erros de poll transitórios
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 5000);
    return () => clearInterval(intervalRef.current!);
  }, [simulacaoId]);

  const handleIniciar = async () => {
    setIniciando(true);
    setErro(null);
    setRelatorio(null);
    setStatus(null);
    try {
      const resp = await iniciarSimulacao(noticiaId);
      setSimulacaoId(resp.simulacao_id);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao iniciar simulação.");
    } finally {
      setIniciando(false);
    }
  };

  const handleReiniciar = () => {
    setSimulacaoId(null);
    setStatus(null);
    setRelatorio(null);
    setErro(null);
  };

  const progresso =
    status?.progresso ?? (status ? STATUS_PROGRESSO_ESTIMADO[status.status] : 0);
  const emAndamento =
    status &&
    status.status !== "concluido" &&
    status.status !== "falhou";

  return (
    <Card className="border-slate-800">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-violet-600">
              <Brain className="h-3 w-3 text-white" />
            </div>
            Simulação MiroFish
          </div>
        </CardTitle>
        <p className="text-xs text-slate-500 leading-relaxed">
          Simula como milhares de atores geopolíticos — governos, mídia, especialistas e
          opinião pública — reagem a este evento. Pode levar 10–30 min.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estado inicial — botão de iniciar */}
        {!simulacaoId && !iniciando && (
          <button
            onClick={handleIniciar}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-violet-800 bg-violet-950/40 px-4 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-900/40 hover:border-violet-700 transition-colors"
          >
            <Play className="h-4 w-4" />
            Simular com MiroFish
          </button>
        )}

        {/* Iniciando */}
        {iniciando && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Iniciando simulação…
          </div>
        )}

        {/* Em andamento */}
        {emAndamento && status && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {STATUS_LABELS[status.status]}
              </span>
              <Badge variant="slate">{progresso}%</Badge>
            </div>
            <Progress value={progresso} barClassName="bg-violet-500" />
            {status.rounds_completados > 0 && (
              <p className="text-xs text-slate-500">
                {status.rounds_completados} rounds · {status.agentes_count} agentes
              </p>
            )}
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="rounded-lg border border-rose-900 bg-rose-950/30 p-3 space-y-2">
            <p className="text-xs text-rose-400">{erro}</p>
            <button
              onClick={handleReiniciar}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300"
            >
              <RotateCcw className="h-3 w-3" /> Tentar novamente
            </button>
          </div>
        )}

        {/* Resultado */}
        {relatorio && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="emerald">Concluído</Badge>
              <button
                onClick={handleReiniciar}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400"
              >
                <RotateCcw className="h-3 w-3" /> Nova simulação
              </button>
            </div>
            <RelatorioView relatorio={relatorio} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
