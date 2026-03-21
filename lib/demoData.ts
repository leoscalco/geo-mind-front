/**
 * Demo data for local development.
 * Models the GeoMind backend response shape exactly.
 * Replace with real API calls in production.
 */

import { NexusAnalysis } from "@/types/geoMind";

const today = new Date();
const daysAgo = (n: number) =>
  new Date(today.getTime() - n * 86_400_000).toISOString().split("T")[0];

export const DEMO_ANALYSIS: NexusAnalysis = {
  id: "demo-001",
  created_at: new Date().toISOString(),
  status: "COMPLETED",
  overall_similarity_score: 0.82,

  news_summary: {
    id: "news-001",
    title: "Iran ameaça bloquear Estreito de Ormuz em resposta a sanções dos EUA",
    summary:
      "Autoridades iranianas voltaram a ameaçar o fechamento do Estreito de Ormuz após os Estados Unidos anunciarem um novo pacote de sanções. O estreito é rota de aproximadamente 20% do petróleo mundial, e a ameaça provocou alta imediata nos contratos futuros de crude. Analistas temem escalada que pode envolver a Marinha americana.",
    source: "Reuters Brasil",
    published_at: new Date().toISOString(),
    category: "geopolitics",
    sentiment: "NEGATIVE",
    impact_score: 87,
    tags: ["Ormuz", "Iran", "Petróleo", "Sanções"],
    region: "Oriente Médio",
  },

  historical_events: [
    {
      id: "hist-001",
      year: 1979,
      title: "Revolução Iraniana",
      description:
        "A queda do Xá Reza Pahlavi e a instauração da República Islâmica cortaram o fornecimento de petróleo iraniano e desencadearam o segundo choque do petróleo.",
      asset: "crude_oil",
      similarity_score: 0.82,
      data_points: [
        { date: daysAgo(30), current_value: 82.4, historical_value: 14.5 },
        { date: daysAgo(25), current_value: 84.1, historical_value: 15.2 },
        { date: daysAgo(20), current_value: 85.7, historical_value: 17.8 },
        { date: daysAgo(15), current_value: 86.3, historical_value: 22.4 },
        { date: daysAgo(10), current_value: 87.9, historical_value: 28.7 },
        { date: daysAgo(5),  current_value: 89.2, historical_value: 35.1 },
        { date: daysAgo(2),  current_value: 91.8, historical_value: 38.9 },
        { date: daysAgo(1),  current_value: 94.3, historical_value: 39.5 },
        { date: daysAgo(0),  current_value: 96.1, historical_value: 40.1,
          event_label: "Pico da crise — Out 1979" },
      ],
    },
    {
      id: "hist-002",
      year: 1990,
      title: "Guerra do Golfo",
      description:
        "A invasão do Kuwait pelo Iraque gerou incerteza sobre o fornecimento global de petróleo e disparou os preços.",
      asset: "crude_oil",
      similarity_score: 0.61,
      data_points: [],
    },
  ],

  best_match: null, // populated below

  market_metrics: [
    { symbol: "USD/BRL", name: "Dólar", value: 5.87, change: 0.03, change_pct: 0.51, currency: "BRL" },
    { symbol: "SELIC",   name: "Selic",  value: 10.75, change: 0, change_pct: 0, currency: "%" },
    { symbol: "BTC",     name: "Bitcoin", value: 94_200, change: -820, change_pct: -0.86, currency: "USD" },
    { symbol: "PETR4",   name: "Petrobras", value: 38.52, change: 1.14, change_pct: 3.05, currency: "BRL" },
    { symbol: "IBOV",    name: "Ibovespa", value: 128_450, change: 1230, change_pct: 0.97, currency: "BRL" },
    { symbol: "WTI",     name: "Petróleo WTI", value: 87.34, change: 2.15, change_pct: 2.52, currency: "USD" },
  ],

  geopolitical_indicators: {
    brasil_risk_score: 62,
    brasilia_sentiment: 41,
    global_uncertainty_index: 78,
    energy_security_score: 55,
  },

  playbook: [
    {
      id: "play-001",
      asset: "PETR4",
      action: "BUY",
      rationale:
        "Alta do petróleo beneficia diretamente a Petrobras. Exposição ao ciclo de commodities energy com correlação histórica positiva em crises de Ormuz.",
      confidence: 78,
      time_horizon: "3-6 meses",
      risk_level: "MEDIUM",
    },
    {
      id: "play-002",
      asset: "USD/BRL",
      action: "HEDGE",
      rationale:
        "Dólar tende a se valorizar em momentos de aversão ao risco global. Hedge cambial protege portfólios em BRL durante escalada geopolítica.",
      confidence: 85,
      time_horizon: "1-3 meses",
      risk_level: "LOW",
    },
    {
      id: "play-003",
      asset: "VALE3",
      action: "HOLD",
      rationale:
        "Minério de ferro pode ser afetado por desaceleração chinesa em cenário de prolongamento do conflito.",
      confidence: 60,
      time_horizon: "2-4 meses",
      risk_level: "MEDIUM",
    },
    {
      id: "play-004",
      asset: "BTC",
      action: "BUY",
      rationale:
        "Bitcoin historicamente se valoriza como reserva de valor não soberana em contextos de instabilidade geopolítica prolongada.",
      confidence: 55,
      time_horizon: "6-12 meses",
      risk_level: "HIGH",
    },
  ],
};

// Fix best_match reference
DEMO_ANALYSIS.best_match = DEMO_ANALYSIS.historical_events[0];
