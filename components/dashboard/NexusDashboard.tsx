"use client";

import { useState } from "react";
import { Brain, Cpu, RefreshCw } from "lucide-react";
import { AnaliseGeopoliticaDTO } from "@/types/geoMind";
import { NewsCard } from "./NewsCard";
import { HistoricalChart } from "./HistoricalChart";
import { GeopoliticalKPIs } from "./GeopoliticalKPIs";
import { Playbook } from "./Playbook";
import { MarketTicker } from "./MarketTicker";
import { AnalyzeForm } from "./AnalyzeForm";
import { DEMO_ANALISE } from "@/lib/demoData";

interface NexusDashboardProps {
  initialAnalise?: AnaliseGeopoliticaDTO;
}

export function NexusDashboard({ initialAnalise }: NexusDashboardProps) {
  const [analise, setAnalise] = useState<AnaliseGeopoliticaDTO | null>(
    initialAnalise ?? DEMO_ANALISE
  );
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-100">
                NEXUS MACRO
              </h1>
              <p className="text-[10px] text-slate-500 leading-none">
                Geopolítica · História · Economia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {loading && (
              <div className="flex items-center gap-1.5 text-xs text-blue-400">
                <Cpu className="h-3 w-3 animate-pulse" />
                <span className="hidden sm:block">Analisando…</span>
              </div>
            )}
            {analise && !loading && (
              <button
                onClick={() => setAnalise(null)}
                className="flex items-center gap-1.5 rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Nova análise
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* ── Analyze Form ──────────────────────────────────────────────── */}
        {!analise && !loading && (
          <div className="mx-auto max-w-xl mt-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-100">
                Analise uma Notícia Geopolítica
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                A IA conecta o evento atual com análogos históricos e gera
                insights de mercado para o Brasil.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <AnalyzeForm onResult={setAnalise} onLoading={setLoading} />
            </div>
          </div>
        )}

        {/* ── Loading skeleton ──────────────────────────────────────────── */}
        {loading && !analise && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <NewsCard analise={null} loading />
              <HistoricalChart analise={null} loading />
              <Playbook analise={null} loading />
            </div>
            <div className="space-y-4">
              <GeopoliticalKPIs analise={null} loading />
            </div>
          </div>
        )}

        {/* ── Dashboard Grid ────────────────────────────────────────────── */}
        {analise && !loading && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left — 2/3 width */}
            <div className="space-y-4 lg:col-span-2">
              <NewsCard analise={analise} />
              <HistoricalChart analise={analise} />
              <Playbook analise={analise} />
            </div>

            {/* Right — 1/3 width */}
            <div className="space-y-4">
              <GeopoliticalKPIs analise={analise} />
            </div>
          </div>
        )}
      </main>

      {/* ── Market Ticker ─────────────────────────────────────────────── */}
      <MarketTicker dados={analise?.dados_financeiros ?? null} />
    </div>
  );
}
