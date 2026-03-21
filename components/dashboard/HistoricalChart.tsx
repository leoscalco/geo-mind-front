"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { History, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { HistoricalEvent } from "@/types/geoMind";

interface HistoricalChartProps {
  event: HistoricalEvent | null;
  loading?: boolean;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const eventLabel = payload[0]?.name === "Atual"
    ? null
    : payload.find(p => p.name !== "Atual");

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl min-w-[180px]">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300">{entry.name}</span>
          </span>
          <span className="font-bold text-slate-100">
            {typeof entry.value === "number"
              ? entry.value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })
              : entry.value}
          </span>
        </div>
      ))}
      {eventLabel && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <p className="text-xs text-blue-400 italic">
            Contexto histórico análogo
          </p>
        </div>
      )}
    </div>
  );
}

export function HistoricalChart({ event, loading }: HistoricalChartProps) {
  if (loading || !event) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const similarityPct = Math.round(event.similarity_score * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-blue-400" />
            Rima Histórica
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="blue">
            <TrendingUp className="h-3 w-3 mr-1" />
            {similarityPct}% similar
          </Badge>
          <Badge variant="slate">{event.year}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-slate-200">{event.title}</h4>
          <p className="text-xs text-slate-400 mt-1">{event.description}</p>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={event.data_points}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: string) =>
                new Date(val).toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) =>
                val >= 1000
                  ? `${(val / 1000).toFixed(0)}k`
                  : val.toFixed(0)
              }
              width={45}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              formatter={(value: string) => (
                <span style={{ color: "#94a3b8" }}>{value}</span>
              )}
            />

            <Area
              type="monotone"
              dataKey="historical_value"
              name={`${event.year} — ${event.title}`}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 3"
              fill="url(#historicalGrad)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#3b82f6",
                stroke: "#1e3a5f",
                strokeWidth: 2,
              }}
            />

            <Area
              type="monotone"
              dataKey="current_value"
              name="Atual"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#currentGrad)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#10b981",
                stroke: "#064e3b",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>

        <p className="text-xs text-slate-500 text-center mt-2">
          Linha verde = preço atual · Linha azul tracejada = análogo histórico ({event.year})
        </p>
      </CardContent>
    </Card>
  );
}
