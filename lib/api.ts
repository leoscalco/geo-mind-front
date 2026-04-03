/**
 * GeoMind API Client
 *
 * Connects to the GeoMind FastAPI backend at http://localhost:8000.
 * Base URL is configured via NEXT_PUBLIC_GEOMIND_API_URL env var.
 *
 * Backend routes (FastAPI):
 *   GET  /api/v1/dashboard/hoje         → DashboardDiarioDTO (today)
 *   GET  /api/v1/dashboard/{YYYY-MM-DD} → DashboardDiarioDTO (by date)
 *   POST /api/v1/dashboard/trigger      → TriggerResponse (202)
 *   POST /api/v1/analisar               → NoticiaAnaliseDTO (manual analysis)
 *   GET  /api/v1/historico              → HistoricoDTO (paginated)
 *   GET  /api/v1/financeiro/snapshot    → DadosFinanceirosDTO (live market data)
 *   GET  /health                        → HealthResponse
 */

import {
  AnalisarRequest,
  DadosFinanceirosDTO,
  DashboardDiarioDTO,
  HealthResponse,
  HistoricoDTO,
  NoticiaAnaliseDTO,
  TriggerResponse,
} from "@/types/geoMind";

const BASE_URL =
  process.env.NEXT_PUBLIC_GEOMIND_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GeoMind API error ${res.status}: ${error}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Fetch today's dashboard (top 5 analysed news).
 * Returns null if no dashboard exists yet (404).
 */
export async function getDashboardHoje(): Promise<DashboardDiarioDTO | null> {
  try {
    return await request<DashboardDiarioDTO>("/api/v1/dashboard/hoje");
  } catch (err) {
    if (err instanceof Error && err.message.includes("404")) return null;
    throw err;
  }
}

/**
 * Fetch dashboard for a specific date (YYYY-MM-DD).
 * Returns null if not found (404).
 */
export async function getDashboardPorData(
  data: string
): Promise<DashboardDiarioDTO | null> {
  try {
    return await request<DashboardDiarioDTO>(`/api/v1/dashboard/${data}`);
  } catch (err) {
    if (err instanceof Error && err.message.includes("404")) return null;
    throw err;
  }
}

/**
 * Trigger the daily pipeline to generate today's dashboard (async — 202).
 */
export async function triggerDashboard(): Promise<TriggerResponse> {
  return request<TriggerResponse>("/api/v1/dashboard/trigger", {
    method: "POST",
  });
}

/**
 * Submit a news article for manual geopolitical analysis.
 * May take 30–90 s (8 sequential AI agents).
 */
export async function analisar(
  payload: AnalisarRequest
): Promise<NoticiaAnaliseDTO> {
  return request<NoticiaAnaliseDTO>("/api/v1/analisar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Paginated history of past dashboards.
 */
export async function getHistorico(
  limite = 10,
  offset = 0
): Promise<HistoricoDTO> {
  return request<HistoricoDTO>(
    `/api/v1/historico?limite=${limite}&offset=${offset}`
  );
}

/**
 * Live financial snapshot (yfinance — ~15 min delay for US markets).
 * Returns null on error (service unavailable).
 */
export async function getSnapshotFinanceiro(): Promise<DadosFinanceirosDTO | null> {
  try {
    return await request<DadosFinanceirosDTO>("/api/v1/financeiro/snapshot");
  } catch {
    return null;
  }
}

/**
 * Health check.
 */
export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}
