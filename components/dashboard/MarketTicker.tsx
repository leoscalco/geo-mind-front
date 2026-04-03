"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { DadosFinanceirosDTO } from "@/types/geoMind";
import { cn } from "@/lib/utils";

interface TickerEntry {
  symbol: string;
  value: number;
  variacao: number;
  format: "usd" | "brl_rate" | "pts" | "pct";
}

function buildEntries(dados: DadosFinanceirosDTO): TickerEntry[] {
  const entries: TickerEntry[] = [];

  if (dados.ibovespa !== null)
    entries.push({ symbol: "IBOV", value: dados.ibovespa, variacao: dados.ibovespa_variacao_pct, format: "pts" });
  if (dados.nasdaq !== null)
    entries.push({ symbol: "NASDAQ", value: dados.nasdaq, variacao: dados.nasdaq_variacao_pct, format: "pts" });
  if (dados.sp500 !== null)
    entries.push({ symbol: "S&P 500", value: dados.sp500, variacao: dados.sp500_variacao_pct, format: "pts" });
  if (dados.petroleo_wti !== null)
    entries.push({ symbol: "WTI", value: dados.petroleo_wti, variacao: dados.petroleo_wti_variacao_pct, format: "usd" });
  if (dados.petroleo_brent !== null)
    entries.push({ symbol: "Brent", value: dados.petroleo_brent, variacao: dados.petroleo_brent_variacao_pct, format: "usd" });
  if (dados.ouro !== null)
    entries.push({ symbol: "Ouro", value: dados.ouro, variacao: dados.ouro_variacao_pct, format: "usd" });
  if (dados.prata !== null)
    entries.push({ symbol: "Prata", value: dados.prata, variacao: dados.prata_variacao_pct, format: "usd" });
  if (dados.usd_brl !== null)
    entries.push({ symbol: "USD/BRL", value: dados.usd_brl, variacao: dados.usd_brl_variacao_pct, format: "brl_rate" });
  if (dados.eur_brl !== null)
    entries.push({ symbol: "EUR/BRL", value: dados.eur_brl, variacao: dados.eur_brl_variacao_pct, format: "brl_rate" });
  if (dados.bitcoin !== null)
    entries.push({ symbol: "BTC", value: dados.bitcoin, variacao: dados.bitcoin_variacao_pct, format: "usd" });
  if (dados.tesouro_selic?.taxa_anual !== null && dados.tesouro_selic?.taxa_anual !== undefined)
    entries.push({ symbol: "SELIC", value: dados.tesouro_selic.taxa_anual, variacao: 0, format: "pct" });

  return entries;
}

function formatValue(value: number, format: TickerEntry["format"]): string {
  switch (format) {
    case "usd":
      return `$ ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "brl_rate":
      return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
    case "pts":
      return value.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
    case "pct":
      return `${value.toFixed(2)}% a.a.`;
  }
}

function TickerItem({ entry }: { entry: TickerEntry }) {
  const isPositive = entry.variacao > 0;
  const isZero = entry.variacao === 0;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 flex-shrink-0">
      <span className="text-xs text-slate-500 font-medium">{entry.symbol}</span>
      <span className="text-sm font-bold text-slate-100 tabular-nums">
        {formatValue(entry.value, entry.format)}
      </span>
      {entry.format !== "pct" && (
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs font-semibold tabular-nums",
            isZero ? "text-slate-500" : isPositive ? "text-emerald-400" : "text-rose-400"
          )}
        >
          {isZero ? (
            <Minus className="h-3 w-3" />
          ) : isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {isPositive ? "+" : ""}
          {entry.variacao.toFixed(2)}%
        </span>
      )}
    </div>
  );
}

interface MarketTickerProps {
  dados: DadosFinanceirosDTO | null;
}

export function MarketTicker({ dados }: MarketTickerProps) {
  const entries = dados ? buildEntries(dados) : DEMO_ENTRIES;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="flex items-center overflow-hidden">
        <div className="flex-shrink-0 px-3 py-1.5 border-r border-slate-800">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            MERCADOS
          </span>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center ticker-scroll">
            {[...entries, ...entries].map((e, i) => (
              <TickerItem key={`${e.symbol}-${i}`} entry={e} />
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 px-3 py-1.5 border-l border-slate-800">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            NEXUS
          </span>
        </div>
      </div>
    </div>
  );
}

const DEMO_ENTRIES: TickerEntry[] = [
  { symbol: "IBOV", value: 128450, variacao: -0.85, format: "pts" },
  { symbol: "NASDAQ", value: 17820, variacao: -0.43, format: "pts" },
  { symbol: "WTI", value: 118.45, variacao: 3.87, format: "usd" },
  { symbol: "Ouro", value: 2350, variacao: 1.2, format: "usd" },
  { symbol: "USD/BRL", value: 5.14, variacao: 0.6, format: "brl_rate" },
  { symbol: "BTC", value: 68200, variacao: -1.3, format: "usd" },
];
