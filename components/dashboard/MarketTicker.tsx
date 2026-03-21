"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingDown, TrendingUp, Wifi, WifiOff } from "lucide-react";
import { MarketMetric } from "@/types/geoMind";
import { getMarketMetrics } from "@/lib/api";
import { cn } from "@/lib/utils";

interface MarketTickerProps {
  initialMetrics?: MarketMetric[];
  refreshIntervalMs?: number;
}

function TickerItem({ metric }: { metric: MarketMetric }) {
  const isPositive = metric.change_pct >= 0;
  const prevRef = useRef(metric.value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (metric.value !== prevRef.current) {
      setFlash(metric.value > prevRef.current ? "up" : "down");
      prevRef.current = metric.value;
      const t = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(t);
    }
  }, [metric.value]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 rounded transition-colors duration-300 flex-shrink-0",
        flash === "up" && "bg-emerald-500/10",
        flash === "down" && "bg-rose-500/10"
      )}
    >
      <span className="text-xs text-slate-400 font-medium">{metric.symbol}</span>
      <span className="text-sm font-bold text-slate-100 tabular-nums">
        {metric.currency === "BRL"
          ? `R$ ${metric.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
          : metric.currency === "USD"
          ? `$ ${metric.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
          : metric.value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
      </span>
      <span
        className={cn(
          "flex items-center gap-0.5 text-xs font-semibold tabular-nums",
          isPositive ? "text-emerald-400" : "text-rose-400"
        )}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {isPositive ? "+" : ""}
        {metric.change_pct.toFixed(2)}%
      </span>
    </div>
  );
}

export function MarketTicker({
  initialMetrics = [],
  refreshIntervalMs = 15_000,
}: MarketTickerProps) {
  const [metrics, setMetrics] = useState<MarketMetric[]>(initialMetrics);
  const [connected, setConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (initialMetrics.length > 0) setMetrics(initialMetrics);
  }, [initialMetrics]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMarketMetrics();
        setMetrics(data);
        setConnected(true);
        setLastUpdate(new Date());
      } catch {
        setConnected(false);
      }
    };

    const interval = setInterval(fetchMetrics, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [refreshIntervalMs]);

  // Fallback demo metrics when backend is not available
  const displayMetrics =
    metrics.length > 0
      ? metrics
      : DEMO_METRICS;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="flex items-center">
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-800 flex-shrink-0">
          {connected ? (
            <Wifi className="h-3 w-3 text-emerald-500" />
          ) : (
            <WifiOff className="h-3 w-3 text-rose-500" />
          )}
          <span className="text-xs text-slate-500 hidden sm:block">
            {lastUpdate.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center ticker-scroll">
            {[...displayMetrics, ...displayMetrics].map((m, i) => (
              <TickerItem key={`${m.symbol}-${i}`} metric={m} />
            ))}
          </div>
        </div>

        {/* Divider label */}
        <div className="px-3 py-1.5 border-l border-slate-800 flex-shrink-0">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            NEXUS
          </span>
        </div>
      </div>
    </div>
  );
}

// Demo data used when the backend is unavailable
const DEMO_METRICS: MarketMetric[] = [
  { symbol: "USD/BRL", name: "Dólar", value: 5.87, change: 0.03, change_pct: 0.51, currency: "BRL" },
  { symbol: "SELIC", name: "Selic", value: 10.75, change: 0, change_pct: 0, currency: "%" },
  { symbol: "BTC/USD", name: "Bitcoin", value: 94_200, change: -820, change_pct: -0.86, currency: "USD" },
  { symbol: "PETR4", name: "Petrobras", value: 38.52, change: 1.14, change_pct: 3.05, currency: "BRL" },
  { symbol: "IBOV", name: "Ibovespa", value: 128_450, change: 1230, change_pct: 0.97, currency: "BRL" },
  { symbol: "WTI", name: "Petróleo WTI", value: 87.34, change: 2.15, change_pct: 2.52, currency: "USD" },
  { symbol: "EUR/USD", name: "Euro", value: 1.082, change: -0.003, change_pct: -0.28, currency: "USD" },
];
