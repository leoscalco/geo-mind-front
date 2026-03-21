/**
 * GeoMind API Client
 *
 * Connects to the GeoMind FastAPI backend.
 * Base URL is configured via NEXT_PUBLIC_GEOMIND_API_URL env var.
 *
 * Backend routes (FastAPI):
 *   POST /analyze          → Submits news for analysis (returns AnalysisJob)
 *   GET  /analysis/{id}    → Fetches completed NexusAnalysis
 *   GET  /jobs/{job_id}    → Polls job status (AnalysisJob)
 *   GET  /market/metrics   → Live market ticker data (MarketMetric[])
 *   GET  /health           → Health check
 */

import {
  AnalysisJob,
  AnalyzeNewsRequest,
  MarketMetric,
  NexusAnalysis,
} from "@/types/geoMind";

const BASE_URL =
  process.env.NEXT_PUBLIC_GEOMIND_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
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

// ─── Analysis ────────────────────────────────────────────────────────────────

/**
 * Submit news for geopolitical + historical analysis.
 * Returns an async job. Poll /jobs/{job_id} until COMPLETED.
 */
export async function analyzeNews(
  payload: AnalyzeNewsRequest
): Promise<AnalysisJob> {
  return request<AnalysisJob>("/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Poll job status. Resolves to AnalysisJob with result when COMPLETED.
 */
export async function getJob(jobId: string): Promise<AnalysisJob> {
  return request<AnalysisJob>(`/jobs/${jobId}`);
}

/**
 * Fetch a completed NexusAnalysis by ID.
 */
export async function getAnalysis(id: string): Promise<NexusAnalysis> {
  return request<NexusAnalysis>(`/analysis/${id}`);
}

/**
 * List recent analyses.
 */
export async function listAnalyses(limit = 10): Promise<NexusAnalysis[]> {
  return request<NexusAnalysis[]>(`/analysis?limit=${limit}`);
}

// ─── Market ──────────────────────────────────────────────────────────────────

/**
 * Fetch live market metrics for the ticker bar.
 */
export async function getMarketMetrics(): Promise<MarketMetric[]> {
  return request<MarketMetric[]>("/market/metrics");
}

// ─── Polling helper ──────────────────────────────────────────────────────────

/**
 * Polls a job every `intervalMs` until it reaches COMPLETED or ERROR.
 * Calls `onUpdate` on each poll. Rejects on ERROR or timeout.
 */
export async function pollJob(
  jobId: string,
  onUpdate: (job: AnalysisJob) => void,
  { intervalMs = 2000, timeoutMs = 120_000 } = {}
): Promise<AnalysisJob> {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error("Job polling timed out"));
        return;
      }

      try {
        const job = await getJob(jobId);
        onUpdate(job);

        if (job.status === "COMPLETED") {
          resolve(job);
        } else if (job.status === "ERROR") {
          reject(new Error(job.error || "Job failed"));
        } else {
          setTimeout(tick, intervalMs);
        }
      } catch (err) {
        reject(err);
      }
    };

    tick();
  });
}
