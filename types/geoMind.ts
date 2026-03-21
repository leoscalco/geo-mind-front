// DTOs that mirror the GeoMind FastAPI Pydantic schemas
// Keep field names in sync with backend models

export type MarketImpactForecast = "Bull" | "Bear" | "Neutral";

export type BrasiliaSentiment = "Positivo" | "Negativo" | "Neutro";

export interface DadosFinanceiros {
  petroleo_preco: number | null;
  btc_preco: number | null;
  ibovespa_valor: number | null;
  dolar_brl: number | null;
  variacao_petroleo_pct: number | null;
  variacao_btc_pct: number | null;
  variacao_ibovespa_pct: number | null;
  variacao_dolar_pct: number | null;
}

export interface AnaliseGeopoliticaDTO {
  news_summary: string;
  historical_correlation_score: number;   // float 0.0–1.0
  historical_event_match: string;         // e.g. "Crise do Petróleo de 1973"
  market_impact_forecast: MarketImpactForecast;
  brasilia_sentiment: BrasiliaSentiment;
  analise_detalhada: string | null;
  dados_financeiros: DadosFinanceiros | null;
  timestamp: string;                      // ISO datetime
  tokens_utilizados: number | null;
}

// Request body for POST /api/v1/analisar
export interface AnalisarRequest {
  titulo: string;    // 5–500 chars, required
  conteudo: string;  // min 10 chars, required
  fonte?: string;    // optional
}

// GET /health response
export interface HealthResponse {
  status: string;
  version: string;
  env: string;
}
