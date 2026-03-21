"use client";

import { useState } from "react";
import { Brain, Cpu, RefreshCw } from "lucide-react";
import { NexusAnalysis } from "@/types/geoMind";
import { NewsCard } from "./NewsCard";
import { HistoricalChart } from "./HistoricalChart";
import { GeopoliticalKPIs } from "./GeopoliticalKPIs";
import { Playbook } from "./Playbook";
import { MarketTicker } from "./MarketTicker";
import { AnalyzeForm } from "./AnalyzeForm";
import { DEMO_ANALYSIS } from "@/lib/demoData";

interface NexusDashboardProps {
  /** Pass an initial NexusAnalysis from SSR / server component */
  initialAnalysis?: NexusAnalysis;
  /** Set false to show premium-locked playbook items */
  isPremium?: boolean;
}

export function NexusDashboard({
  initialAnalysis,
  isPremium = true,
}: NexusDashboardProps) {
  const [analysis, setAnalysis] = useState<NexusAnalysis | null>(
    initialAnalysis ?? DEMO_ANALYSIS
  );
  const [loading, setLoading] = useState(false);

  const bestMatch = analysis?.best_match ?? analysis?.historical_events?.[0] ?? null;

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
                <span className="hidden sm:block">Processando...</span>
              </div>
            )}
            {analysis && !loading && (
              <button
                onClick={() => setAnalysis(null)}
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
        {!analysis && !loading && (
          <div className="mx-auto max-w-xl mt-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-100">
                Analise uma Notícia Geopolítica
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                A IA conecta o evento atual com análogos históricos e gera um
                playbook estratégico.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <AnalyzeForm
                onResult={setAnalysis}
                onLoading={setLoading}
              />
            </div>
          </div>
        )}

        {/* ── Dashboard Grid ────────────────────────────────────────────── */}
        {(analysis || loading) && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left column — full height on mobile, 2/3 on desktop */}
            <div className="space-y-4 lg:col-span-2">
              {/* Notícia Ativa */}
              <NewsCard news={analysis?.news_summary ?? null} loading={loading} />

              {/* Rima Histórica */}
              <HistoricalChart event={bestMatch} loading={loading} />
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* KPIs Geopolíticos */}
              <GeopoliticalKPIs
                indicators={analysis?.geopolitical_indicators ?? null}
                similarityScore={analysis?.overall_similarity_score ?? 0}
                loading={loading}
              />

              {/* Playbook */}
              <Playbook
                recommendations={analysis?.playbook ?? []}
                loading={loading}
                isPremium={isPremium}
              />
            </div>
          </div>
        )}

        {/* Loading state — show skeleton grid */}
        {loading && !analysis && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <NewsCard news={null} loading />
              <HistoricalChart event={null} loading />
            </div>
            <div className="space-y-4">
              <GeopoliticalKPIs indicators={null} loading />
              <Playbook recommendations={[]} loading />
            </div>
          </div>
        )}
      </main>

      {/* ── Market Ticker ─────────────────────────────────────────────── */}
      <MarketTicker
        initialMetrics={analysis?.market_metrics ?? []}
        refreshIntervalMs={15_000}
      />
    </div>
  );
}
