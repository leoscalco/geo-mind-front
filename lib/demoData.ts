/**
 * Demo data for local development without a running backend.
 * Matches the GeoMind backend DTO schema exactly.
 */

import { DadosFinanceirosDTO, DashboardDiarioDTO, NoticiaAnaliseDTO } from "@/types/geoMind";

const NOW = new Date().toISOString();
const TODAY = new Date().toISOString().split("T")[0];

const NOTICIA_1: NoticiaAnaliseDTO = {
  id: "demo-0001",
  titulo: "Tensão no Estreito de Ormuz eleva preço do petróleo a USD 118",
  resumo:
    "Conflito entre forças iranianas e embarcações americanas ameaça 20% do fornecimento mundial de petróleo.",
  fonte: "Reuters",
  url: null,
  publicada_em: NOW,
  palavras_chave: ["petróleo", "Ormuz", "Irã", "EUA", "geopolítica"],
  regioes_afetadas: ["Oriente Médio", "Golfo Pérsico"],
  resumo_executivo:
    "Tensão militar no Estreito de Ormuz eleva o risco de interrupção no fornecimento de petróleo, com impacto direto no IBOVESPA, câmbio e custo de energia no Brasil.",
  por_que_aconteceu:
    "A escalada deve-se ao acúmulo de pressão entre EUA e Irã após anúncio de novas sanções, com o Irã respondendo com exercícios navais na região.",
  o_que_fazer:
    "1. Reduzir exposição a ações de setores importadores de energia. 2. Aumentar posição em Petrobras (PETR4). 3. Comprar dólar como hedge cambial.",
  analise_historica: {
    score_correlacao: 0.87,
    evento_historico_principal: "Crise do Petróleo de 1973",
    crises_similares: [
      {
        nome: "Crise do Petróleo de 1973",
        ano: 1973,
        descricao: "Embargo árabe ao petróleo gerou choque energético global.",
        similaridade: 0.87,
      },
      {
        nome: "Crise do Golfo Pérsico 1990",
        ano: 1990,
        descricao: "Invasão do Kuwait pelo Iraque disparou o preço do petróleo.",
        similaridade: 0.74,
      },
    ],
    narrativa_historica:
      "Assim como em 1973, a ameaça de bloqueio a uma rota estratégica de escoamento de petróleo — dessa vez o Estreito de Ormuz — gera choques de oferta imediatos e aversão ao risco global. Países emergentes exportadores líquidos de petróleo, como o Brasil de hoje, diferem do Brasil de 1973, que era importador, mas a pressão cambial e o ambiente de risk-off são análogos.",
  },
  analise_geopolitica: {
    perspectivas: [
      {
        pais: "Brasil",
        posicao: "Observador com interesse econômico direto",
        impacto_esperado: "Valorização das ações da Petrobras e pressão sobre importadores",
        acoes_provaveis: "Diplomacia discreta; prioridade comercial",
        sentimento: "neutro",
      },
      {
        pais: "EUA",
        posicao: "Parte ativa no conflito com postura de contenção",
        impacto_esperado: "Alta nos preços de energia doméstica; pressão eleitoral",
        acoes_provaveis: "Sanções adicionais; mobilização naval",
        sentimento: "negativo",
      },
      {
        pais: "China",
        posicao: "Maior comprador de petróleo iraniano; oposição às sanções",
        impacto_esperado: "Risco de desabastecimento; escalada da guerra comercial",
        acoes_provaveis: "Mediação diplomática paralela; acúmulo de reservas",
        sentimento: "negativo",
      },
    ],
    tensao_global:
      "Alta tensão com risco real de escalada regional e choque energético global. Nível de alerta geopolítico: 8/10.",
  },
  analise_macro: {
    sentimento_mercado: "bear",
    sentimento_brasil: "negativo",
    previsoes_ativos: [
      {
        ativo: "IBOVESPA",
        direcao: "bear",
        magnitude_esperada: "queda de 2–4% nas próximas semanas",
        justificativa: "Fuga de capitais estrangeiros em ambiente de risk-off global.",
      },
      {
        ativo: "Petróleo WTI",
        direcao: "bull",
        magnitude_esperada: "alta adicional de 5–10% para USD 125–130",
        justificativa: "Prêmio de risco geopolítico com possível interrupção de 20% da oferta.",
      },
      {
        ativo: "USD/BRL",
        direcao: "bull",
        magnitude_esperada: "alta para R$ 5,20–5,35",
        justificativa: "Pressão sobre emergentes e aumento da aversão ao risco.",
      },
      {
        ativo: "Ouro",
        direcao: "bull",
        magnitude_esperada: "alta de 1–3% como ativo safe-haven",
        justificativa: "Demanda por proteção em cenários de conflito geopolítico.",
      },
    ],
    analise_detalhada:
      "A situação atual no Estreito de Ormuz apresenta correlação histórica significativa com a Crise do Petróleo de 1973.\n\n**Pontos de convergência:**\n- Ameaça ao fornecimento de petróleo de uma região estratégica\n- Envolvimento de potências ocidentais como partes em conflito\n- Alta nos preços antes da concretização do bloqueio\n\n**Impacto para o Brasil:**\nComo exportador líquido de petróleo via Petrobras, o Brasil tende a se beneficiar da alta nos preços de commodities. Contudo, o ambiente de aversão ao risco global pressionará o real e elevará o custo de capital.",
    o_que_fazer:
      "Aumentar posição defensiva: reduzir beta da carteira, comprar PETR4, hedge cambial em USD.",
  },
  coleta_social: {
    videos_youtube: [],
    tweets: [],
    podcasts: [],
  },
  coleta_predicao: {
    polymarket: [
      {
        pergunta: "O Irã fechará o Estreito de Ormuz em 2026?",
        probabilidade_sim: 0.18,
        probabilidade_nao: 0.82,
        volume_negociado: 250000,
        url: null,
      },
    ],
    kalshi: [],
    consenso_mercado: "Mercado precifica ~18% de probabilidade de fechamento efetivo do Estreito.",
  },
  dados_financeiros: null,
  fishbone_miro: null,
  tokens_utilizados: 4200,
  gerado_em: NOW,
};

const NOTICIA_2: NoticiaAnaliseDTO = {
  id: "demo-0002",
  titulo: "Fed mantém juros e sinaliza corte apenas em dezembro",
  resumo:
    "O Federal Reserve manteve a taxa dos fed funds em 5,25–5,50% e revisou expectativas de corte para o final do ano.",
  fonte: "Bloomberg",
  url: null,
  publicada_em: NOW,
  palavras_chave: ["Fed", "juros", "EUA", "dólar", "mercados"],
  regioes_afetadas: ["América do Norte", "Mercados Globais"],
  resumo_executivo:
    "Fed hawkish surpreende mercados e eleva dólar globalmente. IBOVESPA tende a sofrer com saída de capital estrangeiro.",
  por_que_aconteceu:
    "Inflação americana ainda acima da meta de 2% impede o Fed de cortar juros, apesar da desaceleração econômica.",
  o_que_fazer:
    "Reduzir duration em renda fixa. Evitar ações de growth. Considerar posição em ativos dolarizados.",
  analise_historica: {
    score_correlacao: 0.71,
    evento_historico_principal: "Ciclo de alta do Fed 2022–2023",
    crises_similares: [
      {
        nome: "Ciclo de alta do Fed 2022–2023",
        ano: 2022,
        descricao: "Alta acumulada de 525 bps em 18 meses para combater inflação pós-pandemia.",
        similaridade: 0.71,
      },
    ],
    narrativa_historica:
      "O atual cenário de juros altos prolongados espelha o ciclo 2022–2023, quando o Fed manteve postura hawkish por mais tempo que o esperado pelo mercado.",
  },
  analise_geopolitica: {
    perspectivas: [
      {
        pais: "Brasil",
        posicao: "Receptor de impacto via câmbio e fluxo de capitais",
        impacto_esperado: "Pressão sobre real e Selic doméstica",
        acoes_provaveis: "BCB pode postergar cortes na Selic",
        sentimento: "negativo",
      },
      {
        pais: "EUA",
        posicao: "Protagonista com foco em controle inflacionário",
        impacto_esperado: "Economia mais lenta, mercado de trabalho resiliente",
        acoes_provaveis: "Manutenção de juros por mais dois trimestres",
        sentimento: "neutro",
      },
      {
        pais: "China",
        posicao: "Beneficiária relativa com yuan pressionado mas exportações competitivas",
        impacto_esperado: "Tensão comercial adicional com EUA",
        acoes_provaveis: "Estímulos fiscais internos para compensar",
        sentimento: "neutro",
      },
    ],
    tensao_global: "Moderada. Risco de recessão americana eleva incerteza global.",
  },
  analise_macro: {
    sentimento_mercado: "bear",
    sentimento_brasil: "negativo",
    previsoes_ativos: [
      {
        ativo: "USD/BRL",
        direcao: "bull",
        magnitude_esperada: "alta para R$ 5,15–5,25",
        justificativa: "Diferencial de juros desfavorável ao real.",
      },
      {
        ativo: "IBOVESPA",
        direcao: "bear",
        magnitude_esperada: "queda de 1–3%",
        justificativa: "Saída de capital estrangeiro para ativos em dólar.",
      },
    ],
    analise_detalhada:
      "O Fed hawkish pressiona emergentes globalmente. Para o Brasil, o impacto é duplo: câmbio mais fraco e dificuldade do BCB em cortar a Selic.",
    o_que_fazer:
      "Hedge cambial, reduzir posição em IBOVESPA, aumentar alocação em Tesouro Selic.",
  },
  coleta_social: { videos_youtube: [], tweets: [], podcasts: [] },
  coleta_predicao: { polymarket: [], kalshi: [], consenso_mercado: null },
  dados_financeiros: null,
  fishbone_miro: null,
  tokens_utilizados: 3800,
  gerado_em: NOW,
};

export const DEMO_DASHBOARD: DashboardDiarioDTO = {
  data: TODAY,
  top5: [NOTICIA_1, NOTICIA_2],
  total_tokens_utilizados: 8000,
  gerado_em: NOW,
  completo: false,
  quantidade_noticias: 2,
};

export const DEMO_FINANCEIRO: DadosFinanceirosDTO = {
  ibovespa: 128450,
  ibovespa_variacao_pct: -0.85,
  nasdaq: 17820,
  nasdaq_variacao_pct: -0.43,
  sp500: 5210,
  sp500_variacao_pct: -0.31,
  petroleo_wti: 118.45,
  petroleo_wti_variacao_pct: 3.87,
  petroleo_brent: 122.1,
  petroleo_brent_variacao_pct: 3.6,
  ouro: 2350,
  ouro_variacao_pct: 1.2,
  prata: 28.4,
  prata_variacao_pct: 0.9,
  usd_brl: 5.14,
  usd_brl_variacao_pct: 0.6,
  eur_brl: 5.62,
  eur_brl_variacao_pct: 0.4,
  bitcoin: 68200,
  bitcoin_variacao_pct: -1.3,
  tesouro_selic: { nome: "Tesouro Selic 2029", taxa_anual: 10.65, preco: null, variacao_pct: 0 },
  tesouro_ipca: { nome: "Tesouro IPCA+ 2035", taxa_anual: 6.12, preco: null, variacao_pct: 0 },
  tesouro_prefixado: { nome: "Tesouro Prefixado 2031", taxa_anual: 12.8, preco: null, variacao_pct: 0 },
  coletado_em: NOW,
};
