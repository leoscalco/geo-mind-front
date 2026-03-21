/**
 * Demo data for local development.
 * Matches the GeoMind backend AnaliseGeopoliticaDTO schema exactly.
 */

import { AnaliseGeopoliticaDTO } from "@/types/geoMind";

export const DEMO_ANALISE: AnaliseGeopoliticaDTO = {
  news_summary:
    "Tensões no Estreito de Ormuz intensificaram-se após anúncio de novas sanções dos EUA ao Irã. Autoridades iranianas ameaçam bloquear a rota, por onde passa cerca de 20% do petróleo mundial. Os mercados reagiram com alta imediata nos contratos futuros de crude, enquanto analistas alertam para risco de escalada envolvendo a Marinha americana.",

  historical_correlation_score: 0.87,

  historical_event_match: "Crise do Petróleo de 1973",

  market_impact_forecast: "Bull",

  brasilia_sentiment: "Negativo",

  analise_detalhada: `A situação atual no Estreito de Ormuz apresenta correlação histórica significativa com a Crise do Petróleo de 1973, quando o embargo árabe ao petróleo gerou choque energético global e recessão nos países importadores.

**Pontos de convergência:**
- Ameaça ao fornecimento de petróleo de uma região estratégica
- Envolvimento de potências ocidentais como partes em conflito
- Alta já registrada nos preços de petróleo antes da concretização do bloqueio
- Incerteza sobre duração e amplitude da crise

**Impacto esperado para o Brasil:**
O Brasil, como exportador líquido de petróleo via Petrobras (PETR4), tende a se beneficiar da alta nos preços de commodities energéticas. Contudo, o ambiente de aversão ao risco global pressionará o real (BRL) e elevará o custo de capital. O Ibovespa pode sofrer pressão de curto prazo pela fuga de capitais estrangeiros, mas o setor de energia deve se destacar positivamente.

**Risco principal:** Escalada militar direta, que quebraria a correlação com 1973 e introduziria uma dinâmica inédita de sanções e bloqueios simultâneos.`,

  dados_financeiros: {
    petroleo_preco: 118.45,
    btc_preco: 62000.0,
    ibovespa_valor: 125000.0,
    dolar_brl: 5.42,
    variacao_petroleo_pct: 3.87,
    variacao_btc_pct: 2.10,
    variacao_ibovespa_pct: -0.85,
    variacao_dolar_pct: 0.45,
  },

  timestamp: new Date().toISOString(),

  tokens_utilizados: 1500,
};
