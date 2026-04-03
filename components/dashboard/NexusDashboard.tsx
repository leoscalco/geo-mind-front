"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Cpu,
  Play,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Minus,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import {
  DadosFinanceirosDTO,
  DashboardDiarioDTO,
  NoticiaAnaliseDTO,
  SentimentoMercado,
} from "@/types/geoMind";
import { getDashboardHoje, getSnapshotFinanceiro, triggerDashboard, analisar } from "@/lib/api";
import { DEMO_DASHBOARD, DEMO_FINANCEIRO } from "@/lib/demoData";
import { NewsCard } from "./NewsCard";
import { HistoricalChart } from "./HistoricalChart";
import { GeopoliticalKPIs } from "./GeopoliticalKPIs";
import { Playbook } from "./Playbook";
import { MarketTicker } from "./MarketTicker";
import { AnalyzeForm } from "./AnalyzeForm";
import { cn } from "@/lib/utils";

interface NexusDashboardProps {
  initialDashboard?: DashboardDiarioDTO;
  initialFinanceiro?: DadosFinanceirosDTO;
}

const sentimentoIcon: Record<SentimentoMercado, React.ReactNode> = {
  bull: <TrendingUp className="h-3 w-3 text-emerald-400" />,
  bear: <TrendingDown className="h-3 w-3 text-rose-400" />,
  neutro: <Minus className="h-3 w-3 text-slate-400" />,
};

const sentimentoColor: Record<SentimentoMercado, string> = {
  bull: "text-emerald-400",
  bear: "text-rose-400",
  neutro: "text-slate-400",
};

function NewsListItem({
  noticia,
  index,
  selected,
  onClick,
}: {
  noticia: NoticiaAnaliseDTO;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  const sentimento = noticia.analise_macro?.sentimento_mercado ?? "neutro";
  const score = noticia.analise_historica?.score_correlacao ?? 0;
  const pct = Math.round(score * 100);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-3 rounded-lg border transition-all group",
        selected
          ? "border-emerald-700 bg-emerald-950/30"
          : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "flex-shrink-0 mt-0.5 text-xs font-black tabular-nums w-4",
            selected ? "text-emerald-400" : "text-slate-600"
          )}
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium leading-snug line-clamp-2 transition-colors",
              selected ? "text-slate-100" : "text-slate-300 group-hover:text-slate-100"
            )}
          >
            {noticia.titulo}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              {sentimentoIcon[sentimento]}
              <span className={sentimentoColor[sentimento]}>
                {sentimento}
              </span>
            </span>
            {pct > 0 && (
              <span className="flex items-center gap-1">
                <span
                  className={cn(
                    "tabular-nums",
                    pct >= 70 ? "text-rose-400" : pct >= 40 ? "text-amber-400" : "text-emerald-400"
                  )}
                >
                  {pct}% hist.
                </span>
              </span>
            )}
            {noticia.fonte && <span className="text-slate-600 truncate">{noticia.fonte}</span>}
          </div>
        </div>
        <ChevronRight
          className={cn(
            "flex-shrink-0 h-4 w-4 mt-0.5 transition-colors",
            selected ? "text-emerald-400" : "text-slate-700 group-hover:text-slate-500"
          )}
        />
      </div>
    </button>
  );
}

export function NexusDashboard({
  initialDashboard,
  initialFinanceiro,
}: NexusDashboardProps) {
  const [dashboard, setDashboard] = useState<DashboardDiarioDTO | null>(
    initialDashboard ?? null
  );
  const [financeiro, setFinanceiro] = useState<DadosFinanceirosDTO | null>(
    initialFinanceiro ?? null
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [manualResult, setManualResult] = useState<NoticiaAnaliseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch financial data on mount (client-side, to get fresh data)
  useEffect(() => {
    if (!financeiro) {
      getSnapshotFinanceiro().then((f) => {
        if (f) setFinanceiro(f);
      });
    }
  }, [financeiro]);

  const handleTrigger = async () => {
    setTriggering(true);
    setError(null);
    try {
      await triggerDashboard();
      // Poll after a short delay — pipeline is async
      setTimeout(async () => {
        const d = await getDashboardHoje();
        if (d) setDashboard(d);
        setTriggering(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao disparar pipeline.");
      setTriggering(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, f] = await Promise.all([getDashboardHoje(), getSnapshotFinanceiro()]);
      if (d) setDashboard(d);
      if (f) setFinanceiro(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualResult = (result: NoticiaAnaliseDTO) => {
    setManualResult(result);
    setShowForm(false);
  };

  // What to show in the detail panel
  const noticias = dashboard?.top5 ?? [];
  const selectedNoticia = manualResult ?? noticias[selectedIndex] ?? null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* ── Header ──────────────────────────────────────────────────────── */}
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

          {dashboard && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span>{dashboard.data}</span>
              <span>·</span>
              <span>{dashboard.quantidade_noticias} análises</span>
              {!dashboard.completo && (
                <span className="text-amber-400">· incompleto</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {(loading || triggering) && (
              <div className="flex items-center gap-1.5 text-xs text-blue-400">
                <Cpu className="h-3 w-3 animate-pulse" />
                <span className="hidden sm:block">
                  {triggering ? "Gerando…" : "Atualizando…"}
                </span>
              </div>
            )}

            {error && (
              <span className="text-xs text-rose-400 hidden sm:block">{error}</span>
            )}

            <button
              onClick={() => {
                setManualResult(null);
                setShowForm((v) => !v);
              }}
              className="flex items-center gap-1.5 rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            >
              <PlusCircle className="h-3 w-3" />
              <span className="hidden sm:block">Analisar</span>
            </button>

            <button
              onClick={handleTrigger}
              disabled={triggering}
              className="flex items-center gap-1.5 rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors disabled:opacity-40"
            >
              <Play className="h-3 w-3" />
              <span className="hidden sm:block">Gerar Dashboard</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* ── Manual Analyze Form ─────────────────────────────────────────── */}
        {showForm && (
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4 max-w-xl mx-auto">
            <h2 className="text-sm font-semibold text-slate-200 mb-3">Análise Manual</h2>
            <AnalyzeForm onResult={handleManualResult} onLoading={setLoading} />
          </div>
        )}

        {/* ── Manual result banner ────────────────────────────────────────── */}
        {manualResult && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-800 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-300">
            <span>Mostrando análise manual: <strong>{manualResult.titulo}</strong></span>
            <button
              onClick={() => setManualResult(null)}
              className="text-slate-500 hover:text-slate-300"
            >
              Voltar ao dashboard
            </button>
          </div>
        )}

        {/* ── No dashboard state ──────────────────────────────────────────── */}
        {!dashboard && !loading && !manualResult && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <Brain className="h-12 w-12 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-300">Nenhum dashboard hoje</h2>
            <p className="text-sm text-slate-500 max-w-md">
              Clique em <strong>Gerar Dashboard</strong> para iniciar o pipeline diário ou use{" "}
              <strong>Analisar</strong> para uma análise manual.
            </p>
            <button
              onClick={handleTrigger}
              disabled={triggering}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
            >
              <Play className="h-4 w-4" />
              {triggering ? "Gerando pipeline…" : "Gerar Dashboard de Hoje"}
            </button>
          </div>
        )}

        {/* ── Loading skeleton ──────────────────────────────────────────── */}
        {loading && !selectedNoticia && (
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

        {/* ── Dashboard with news list ────────────────────────────────────── */}
        {(dashboard || manualResult) && !loading && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {/* ── Left: News List ────────────────────────────────────────── */}
            {noticias.length > 0 && !manualResult && (
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-1">
                    Top {noticias.length} de hoje
                  </p>
                  <div className="space-y-2">
                    {noticias.map((n, i) => (
                      <NewsListItem
                        key={n.id}
                        noticia={n}
                        index={i}
                        selected={selectedIndex === i}
                        onClick={() => setSelectedIndex(i)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Right: Detail ─────────────────────────────────────────── */}
            {selectedNoticia && (
              <div className={cn("grid grid-cols-1 gap-4", noticias.length > 0 && !manualResult ? "lg:col-span-3" : "lg:col-span-4")}>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {/* Main content — 2/3 */}
                  <div className="space-y-4 lg:col-span-2">
                    <NewsCard analise={selectedNoticia} />
                    <HistoricalChart analise={selectedNoticia} />
                    <Playbook analise={selectedNoticia} />
                  </div>

                  {/* Sidebar — 1/3 */}
                  <div className="space-y-4">
                    <GeopoliticalKPIs analise={selectedNoticia} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Market Ticker ─────────────────────────────────────────────── */}
      <MarketTicker dados={financeiro} />
    </div>
  );
}
