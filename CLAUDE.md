# CLAUDE.md — GeoMind Frontend

## Project Overview

**GeoMind Front** is the Next.js frontend for the GeoMind geopolitical intelligence platform.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4 · Recharts · Lucide React · Radix UI · npm

## Setup & Running

```bash
npm install
npm run dev   # http://localhost:3000
npm run build
npm run lint
```

## Backend API

Connects to GeoMind FastAPI at `http://localhost:8000` (or `NEXT_PUBLIC_GEOMIND_API_URL`).

### Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/v1/dashboard/hoje` | Today's dashboard (top 5 analyses) |
| `GET`  | `/api/v1/dashboard/{YYYY-MM-DD}` | Dashboard by date |
| `POST` | `/api/v1/dashboard/trigger` | Trigger daily pipeline (202) |
| `POST` | `/api/v1/analisar` | Manual single-news analysis |
| `GET`  | `/api/v1/historico` | Paginated history |
| `GET`  | `/api/v1/financeiro/snapshot` | Live market data (10+ assets) |
| `GET`  | `/health` | Health check |

### Key DTO Field Names (backend → frontend)

**DashboardDiarioDTO:**
- `data`, `top5` (array of NoticiaAnaliseDTO), `total_tokens_utilizados`, `gerado_em`, `completo`, `quantidade_noticias`

**NoticiaAnaliseDTO:**
- `id`, `titulo`, `resumo`, `fonte`, `url`, `publicada_em`
- `resumo_executivo`, `por_que_aconteceu`, `o_que_fazer`
- `analise_historica` (nested), `analise_geopolitica` (nested), `analise_macro` (nested)
- `coleta_social`, `coleta_predicao`, `dados_financeiros`, `fishbone_miro`
- `tokens_utilizados`, `gerado_em`

**AnaliseMacroDTO:**
- `sentimento_mercado`: `"bull" | "bear" | "neutro"` (lowercase)
- `sentimento_brasil`: `"positivo" | "negativo" | "neutro"` (lowercase)
- `analise_detalhada`, `o_que_fazer`, `previsoes_ativos`

**AnaliseHistoricaDTO:**
- `score_correlacao`, `evento_historico_principal`, `narrativa_historica`, `crises_similares`

**DadosFinanceirosDTO:**
- `ibovespa`, `ibovespa_variacao_pct`, `nasdaq`, `nasdaq_variacao_pct`, `sp500`, `sp500_variacao_pct`
- `petroleo_wti`, `petroleo_wti_variacao_pct`, `petroleo_brent`, `petroleo_brent_variacao_pct`
- `ouro`, `ouro_variacao_pct`, `prata`, `prata_variacao_pct`
- `usd_brl`, `usd_brl_variacao_pct`, `eur_brl`, `eur_brl_variacao_pct`
- `bitcoin`, `bitcoin_variacao_pct`
- `tesouro_selic`, `tesouro_ipca`, `tesouro_prefixado` (AtivoBrasilDTO: `{nome, taxa_anual, preco, variacao_pct}`)
- `coletado_em`

## Architecture

```
app/
├── page.tsx              # Home → loads dashboard/hoje
└── layout.tsx
components/
├── dashboard/
│   ├── NexusDashboard.tsx  # Main dashboard shell (multi-news)
│   ├── NewsCard.tsx         # News list item card
│   ├── NewsDetail.tsx       # Expanded news detail panel
│   ├── GeopoliticalKPIs.tsx # Macro/sentiment KPIs
│   ├── HistoricalChart.tsx  # Historical correlation
│   ├── Playbook.tsx         # Detailed analysis text
│   ├── MarketTicker.tsx     # Bottom market ticker bar
│   └── AnalyzeForm.tsx      # Manual news submission form
└── ui/
    ├── badge.tsx
    ├── card.tsx
    ├── progress.tsx
    └── skeleton.tsx
lib/
├── api.ts       # All API client functions
├── demoData.ts  # Demo data for local dev
└── utils.ts
types/
└── geoMind.ts   # TypeScript types mirroring backend DTOs
```
