"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { DadosFinanceiros } from "@/types/geoMind";
import { cn } from "@/lib/utils";

interface TickerEntry {
  symbol: string;
  label: string;
  value: number;
  variacao: number | null;
  format: "usd" | "brl" | "pts" | "brl_rate";
}

function buildEntries(dados: DadosFinanceiros | null): TickerEntry[] {
  if (!dados) return DEMO_ENTRIES;

  const entries: TickerEntry[] = [];

  if (dados.petroleo_preco !== null) {
    entries.push({
      symbol: "WTI",
      label: "Petróleo WTI",
      value: dados.petroleo_preco,
      variacao: dados.variacao_petroleo_pct,
      format: "usd",
    });
  }
  if (dados.btc_preco !== null) {
    entries.push({
      symbol: "BTC",
      label: "Bitcoin",
      value: dados.btc_preco,
      variacao: dados.variacao_btc_pct,
      format: "usd",
    });
  }
  if (dados.ibovespa_valor !== null) {
    entries.push({
      symbol: "IBOV",
      label: "Ibovespa",
      value: dados.ibovespa_valor,
      variacao: dados.variacao_ibovespa_pct,
      format: "pts",
    });
  }
  if (dados.dolar_brl !== null) {
    entries.push({
      symbol: "USD/BRL",
      label: "Dólar",
      value: dados.dolar_brl,
      variacao: dados.variacao_dolar_pct,
      format: "brl_rate",
    });
  }

  return entries.length > 0 ? entries : DEMO_ENTRIES;
}

function formatValue(value: number, format: TickerEntry["format"]): string {
  switch (format) {
    case "usd":
      return `$ ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "brl":
      return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "brl_rate":
      return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
    case "pts":
      return value.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  }
}

function TickerItem({ entry }: { entry: TickerEntry }) {
  const { variacao } = entry;
  const isPositive = variacao !== null && variacao >= 0;
  const isZero = variacao === null || variacao === 0;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 flex-shrink-0">
      <span className="text-xs text-slate-500 font-medium">{entry.symbol}</span>
      <span className="text-sm font-bold text-slate-100 tabular-nums">
        {formatValue(entry.value, entry.format)}
      </span>
      {variacao !== null && (
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs font-semibold tabular-nums",
            isZero
              ? "text-slate-500"
              : isPositive
              ? "text-emerald-400"
              : "text-rose-400"
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
          {variacao.toFixed(2)}%
        </span>
      )}
    </div>
  );
}

interface MarketTickerProps {
  dados: DadosFinanceiros | null;
}

export function MarketTicker({ dados }: MarketTickerProps) {
  const entries = buildEntries(dados);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="flex items-center overflow-hidden">
        {/* Label */}
        <div className="flex-shrink-0 px-3 py-1.5 border-r border-slate-800">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            MERCADOS
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center ticker-scroll">
            {[...entries, ...entries].map((e, i) => (
              <TickerItem key={`${e.symbol}-${i}`} entry={e} />
            ))}
          </div>
        </div>

        {/* Nexus label */}
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
  { symbol: "WTI", label: "Petróleo WTI", value: 87.34, variacao: 2.52, format: "usd" },
  { symbol: "BTC", label: "Bitcoin", value: 94200, variacao: -0.86, format: "usd" },
  { symbol: "IBOV", label: "Ibovespa", value: 128450, variacao: 0.97, format: "pts" },
  { symbol: "USD/BRL", label: "Dólar", value: 5.87, variacao: 0.51, format: "brl_rate" },
];
