"use client";

import { useState } from "react";
import { Search, Link, FileText } from "lucide-react";
import { analyzeNews, pollJob } from "@/lib/api";
import { NexusAnalysis } from "@/types/geoMind";

interface AnalyzeFormProps {
  onResult: (analysis: NexusAnalysis) => void;
  onLoading: (loading: boolean) => void;
}

export function AnalyzeForm({ onResult, onLoading }: AnalyzeFormProps) {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError(null);
    onLoading(true);
    setStatus("Enviando para análise...");

    try {
      const job = await analyzeNews(
        mode === "url" ? { news_url: input } : { news_text: input }
      );

      setStatus("Processando com IA...");

      const completed = await pollJob(
        job.job_id,
        (j) => {
          if (j.status === "PROCESSING") setStatus("Analisando contexto histórico...");
        },
        { intervalMs: 2000, timeoutMs: 120_000 }
      );

      if (completed.result) {
        onResult(completed.result);
        setInput("");
        setStatus(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao analisar notícia");
      setStatus(null);
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-slate-800 overflow-hidden text-sm">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 transition-colors ${
            mode === "url"
              ? "bg-slate-800 text-slate-100"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Link className="h-3.5 w-3.5" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 transition-colors ${
            mode === "text"
              ? "bg-slate-800 text-slate-100"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Texto
        </button>
      </div>

      {/* Input */}
      {mode === "url" ? (
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://exemplo.com/noticia-geopolitica"
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-600 focus:outline-none"
        />
      ) : (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Cole o texto da notícia aqui..."
          rows={4}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-600 focus:outline-none resize-none"
        />
      )}

      {/* Status / Error */}
      {status && (
        <p className="text-xs text-blue-400 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          {status}
        </p>
      )}
      {error && <p className="text-xs text-rose-400">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={!input.trim()}
        className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Search className="h-4 w-4" />
        Analisar Notícia
      </button>
    </form>
  );
}
