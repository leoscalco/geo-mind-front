// DTOs that mirror the GeoMind FastAPI Pydantic schemas
// Keep field names in sync with backend models

export interface MarketMetric {
  symbol: string;
  name: string;
  value: number;
  change: number;
  change_pct: number;
  currency: string;
}

export interface HistoricalDataPoint {
  date: string;         // ISO date string
  current_value: number;
  historical_value?: number;
  event_label?: string; // e.g. "Revolução Iraniana"
}

export interface HistoricalEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  asset: string;        // e.g. "crude_oil", "ibovespa"
  similarity_score: number; // 0.0 - 1.0
  data_points: HistoricalDataPoint[];
}

export interface PlaybookRecommendation {
  id: string;
  asset: string;
  action: "BUY" | "SELL" | "HOLD" | "HEDGE";
  rationale: string;
  confidence: number; // 0-100
  time_horizon: string; // e.g. "3-6 meses"
  risk_level: "LOW" | "MEDIUM" | "HIGH";
}

export interface NewsSummary {
  id: string;
  title: string;
  summary: string;
  source: string;
  published_at: string; // ISO datetime
  category: string;     // e.g. "geopolitics", "economy", "energy"
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  impact_score: number; // 0-100
  tags: string[];
  region: string;
}

export interface GeopoliticalIndicators {
  brasil_risk_score: number;      // 0-100
  brasilia_sentiment: number;     // 0-100
  global_uncertainty_index: number; // 0-100
  energy_security_score: number;  // 0-100
}

export interface NexusAnalysis {
  id: string;
  created_at: string;
  news_summary: NewsSummary;
  historical_events: HistoricalEvent[];
  best_match: HistoricalEvent | null;
  market_metrics: MarketMetric[];
  geopolitical_indicators: GeopoliticalIndicators;
  playbook: PlaybookRecommendation[];
  overall_similarity_score: number; // 0.0 - 1.0
  status: "PROCESSING" | "COMPLETED" | "ERROR";
}

// Request body for POST /analyze
export interface AnalyzeNewsRequest {
  news_url?: string;
  news_text?: string;
  title?: string;
}

// Response from POST /analyze (async job)
export interface AnalysisJob {
  job_id: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "ERROR";
  result?: NexusAnalysis;
  error?: string;
}
