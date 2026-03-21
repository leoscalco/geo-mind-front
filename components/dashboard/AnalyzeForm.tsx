"use client";

import { useState } from "react";
import { Brain, Clock, Send } from "lucide-react";
import { analisar } from "@/lib/api";
import { AnaliseGeopoliticaDTO } from "@/types/geoMind";

interface AnalyzeFormProps {
  onResult: (analise: AnaliseGeopoliticaDTO) => void;
  onLoading: (loading: boolean) => void;
}

const EXAMPLE = {
  titulo: "Escalada no Oriente Médio: Bloqueio do Estreito de Ormuz",
  conteudo:
    "Tensões geopolíticas elevam o risco de crise energética global com petróleo a USD 120/barril.",
  fonte: "Reuters",
};

export function AnalyzeForm({ onResult, onLoading }: AnalyzeFormProps) {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [fonte, setFonte] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const canSubmit =
    titulo.trim().length >= 5 && conteudo.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    onLoading(true);
    setStatus("Enviando para análise pela IA…");

    try {
      const result = await analisar({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        fonte: fonte.trim() || undefined,
      });

      onResult(result);
      setTitulo("");
      setConteudo("");
      setFonte("");
      setStatus(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao analisar notícia."
      );
      setStatus(null);
    } finally {
      onLoading(false);
    }
  };

  const fillExample = () => {
    setTitulo(EXAMPLE.titulo);
    setConteudo(EXAMPLE.conteudo);
    setFonte(EXAMPLE.fonte);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Título */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-medium">
          Título <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Escalada no Oriente Médio: Bloqueio do Estreito de Ormuz"
          minLength={5}
          maxLength={500}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-600 focus:outline-none"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-medium">
          Conteúdo <span className="text-rose-400">*</span>
        </label>
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Cole o texto completo ou resumo da notícia…"
          rows={4}
          minLength={10}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-600 focus:outline-none resize-none"
        />
      </div>

      {/* Fonte (opcional) */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-medium">
          Fonte{" "}
          <span className="text-slate-600">(opcional)</span>
        </label>
        <input
          type="text"
          value={fonte}
          onChange={(e) => setFonte(e.target.value)}
          placeholder="Reuters, Bloomberg, Folha…"
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-600 focus:outline-none"
        />
      </div>

      {/* Processing hint */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Clock className="h-3 w-3" />
        A análise pode levar 30–90 s (3 agentes de IA em sequência)
      </div>

      {/* Status / Error */}
      {status && (
        <p className="flex items-center gap-2 text-xs text-blue-400">
          <Brain className="h-3 w-3 animate-pulse" />
          {status}
        </p>
      )}
      {error && <p className="text-xs text-rose-400">{error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={fillExample}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline-offset-2 hover:underline"
        >
          Usar exemplo
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="ml-auto flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          Analisar
        </button>
      </div>
    </form>
  );
}
