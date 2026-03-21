/**
 * GeoMind API Client
 *
 * Connects to the GeoMind FastAPI backend at http://localhost:8000.
 * Base URL is configured via NEXT_PUBLIC_GEOMIND_API_URL env var.
 *
 * Backend routes (FastAPI):
 *   POST /api/v1/analisar         → Submit news for analysis (AnaliseGeopoliticaDTO)
 *   GET  /api/v1/historico        → List recent analyses (?limite=10)
 *   GET  /api/v1/ultima-analise   → Get the most recent analysis
 *   GET  /health                  → Health check
 */

import {
  AnaliseGeopoliticaDTO,
  AnalisarRequest,
  HealthResponse,
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
 * Submit a news article for geopolitical analysis.
 * May take 30–90 s (3 sequential AI agents).
 */
export async function analisar(
  payload: AnalisarRequest
): Promise<AnaliseGeopoliticaDTO> {
  return request<AnaliseGeopoliticaDTO>("/api/v1/analisar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * List recent analyses. Defaults to the last 10.
 */
export async function getHistorico(
  limite = 10
): Promise<AnaliseGeopoliticaDTO[]> {
  return request<AnaliseGeopoliticaDTO[]>(`/api/v1/historico?limite=${limite}`);
}

/**
 * Fetch the most recent analysis. Throws if none exist (404).
 */
export async function getUltimaAnalise(): Promise<AnaliseGeopoliticaDTO> {
  return request<AnaliseGeopoliticaDTO>("/api/v1/ultima-analise");
}

/**
 * Health check.
 */
export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}
