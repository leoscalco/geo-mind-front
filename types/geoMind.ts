// DTOs mirroring the GeoMind FastAPI Pydantic schemas exactly.
// Field names must stay in sync with backend — backend is source of truth.

// ─── Enums ────────────────────────────────────────────────────────────────────

export type SentimentoMercado = "bull" | "bear" | "neutro";
export type SentimentoPolitico = "positivo" | "negativo" | "neutro";

// ─── Financial Data ───────────────────────────────────────────────────────────

export interface AtivoBrasilDTO {
  nome: string;
  taxa_anual: number | null;
  preco: number | null;
  variacao_pct: number;
}

export interface DadosFinanceirosDTO {
  ibovespa: number | null;
  ibovespa_variacao_pct: number;
  nasdaq: number | null;
  nasdaq_variacao_pct: number;
  sp500: number | null;
  sp500_variacao_pct: number;
  petroleo_wti: number | null;
  petroleo_wti_variacao_pct: number;
  petroleo_brent: number | null;
  petroleo_brent_variacao_pct: number;
  ouro: number | null;
  ouro_variacao_pct: number;
  prata: number | null;
  prata_variacao_pct: number;
  usd_brl: number | null;
  usd_brl_variacao_pct: number;
  eur_brl: number | null;
  eur_brl_variacao_pct: number;
  bitcoin: number | null;
  bitcoin_variacao_pct: number;
  tesouro_selic: AtivoBrasilDTO | null;
  tesouro_ipca: AtivoBrasilDTO | null;
  tesouro_prefixado: AtivoBrasilDTO | null;
  coletado_em: string | null;
}

// ─── Analysis Sub-DTOs ────────────────────────────────────────────────────────

export interface CriseHistoricaDTO {
  nome: string;
  ano: number;
  descricao: string;
  similaridade: number; // 0-1
}

export interface AnaliseHistoricaDTO {
  score_correlacao: number; // 0-1
  evento_historico_principal: string;
  crises_similares: CriseHistoricaDTO[];
  narrativa_historica: string;
}

export interface PerspectivaPaisDTO {
  pais: string; // Brasil | China | EUA
  posicao: string;
  impacto_esperado: string;
  acoes_provaveis: string;
  sentimento: SentimentoPolitico;
}

export interface AnaliseGeopoliticaDTO {
  perspectivas: PerspectivaPaisDTO[];
  tensao_global: string;
}

export interface PrevisaoAtivoDTO {
  ativo: string;
  direcao: SentimentoMercado;
  magnitude_esperada: string;
  justificativa: string;
}

export interface AnaliseMacroDTO {
  sentimento_mercado: SentimentoMercado;
  sentimento_brasil: SentimentoPolitico;
  previsoes_ativos: PrevisaoAtivoDTO[];
  analise_detalhada: string;
  o_que_fazer: string;
}

// ─── Social & Prediction ─────────────────────────────────────────────────────

export interface FonteYouTubeDTO {
  video_id: string;
  titulo: string;
  canal: string;
  url: string;
  visualizacoes: number;
}

export interface FonteTwitterDTO {
  tweet_id: string;
  autor: string;
  conteudo: string;
  url: string;
  likes: number;
  retweets: number;
}

export interface FontePodcastDTO {
  episodio_id: string;
  titulo: string;
  podcast: string;
  url: string;
  duracao_segundos: number;
}

export interface ColetaSocialDTO {
  videos_youtube: FonteYouTubeDTO[];
  tweets: FonteTwitterDTO[];
  podcasts: FontePodcastDTO[];
}

export interface OpcaoPolymarketDTO {
  pergunta: string;
  probabilidade_sim: number;
  probabilidade_nao: number;
  volume_negociado: number;
  url: string | null;
}

export interface OpcaoKalshiDTO {
  titulo: string;
  probabilidade: number;
  volume_negociado: number;
  url: string | null;
}

export interface ColetaPredicaoDTO {
  polymarket: OpcaoPolymarketDTO[];
  kalshi: OpcaoKalshiDTO[];
  consenso_mercado: string | null;
}

// ─── Miro ────────────────────────────────────────────────────────────────────

export interface OssoFishboneDTO {
  categoria: string;
  causas: string[];
}

export interface EfeitoFishboneDTO {
  area: string;
  descricao: string;
}

export interface FishboneMiroDTO {
  url_board: string;
  evento_central: string;
  ossos_causas: OssoFishboneDTO[];
  efeitos: EfeitoFishboneDTO[];
}

// ─── Main DTOs ────────────────────────────────────────────────────────────────

export interface NoticiaAnaliseDTO {
  id: string;
  titulo: string;
  resumo: string;
  fonte: string;
  url: string | null;
  publicada_em: string; // ISO datetime
  palavras_chave: string[];
  regioes_afetadas: string[];

  resumo_executivo: string;
  por_que_aconteceu: string;
  o_que_fazer: string;

  analise_historica: AnaliseHistoricaDTO | null;
  analise_geopolitica: AnaliseGeopoliticaDTO | null;
  analise_macro: AnaliseMacroDTO | null;
  coleta_social: ColetaSocialDTO | null;
  coleta_predicao: ColetaPredicaoDTO | null;
  dados_financeiros: DadosFinanceirosDTO | null;
  fishbone_miro: FishboneMiroDTO | null;

  tokens_utilizados: number;
  gerado_em: string; // ISO datetime
}

export interface DashboardDiarioDTO {
  data: string; // YYYY-MM-DD
  top5: NoticiaAnaliseDTO[];
  total_tokens_utilizados: number;
  gerado_em: string; // ISO datetime
  completo: boolean;
  quantidade_noticias: number;
}

// ─── Historico ────────────────────────────────────────────────────────────────

export interface HistoricoItemDTO {
  data: string; // YYYY-MM-DD
  gerado_em: string;
  completo: boolean;
  quantidade_noticias: number;
  total_tokens_utilizados: number;
}

export interface PaginacaoDTO {
  total: number;
  limite: number;
  offset: number;
  pagina_atual: number;
  total_paginas: number;
}

export interface HistoricoDTO {
  paginacao: PaginacaoDTO;
  itens: HistoricoItemDTO[];
}

// ─── Requests ────────────────────────────────────────────────────────────────

export interface AnalisarRequest {
  titulo: string; // min 5, max 500
  conteudo: string; // min 20
  fonte: string;
}

export interface TriggerResponse {
  mensagem: string;
  data: string;
  job_id: string;
}

// ─── MiroFish Simulation ─────────────────────────────────────────────────────

export type StatusSimulacao =
  | "pendente"
  | "gerando_grafo"
  | "preparando"
  | "simulando"
  | "gerando_relatorio"
  | "concluido"
  | "falhou";

export interface SimulacaoStatusDTO {
  id: string;
  noticia_id: string;
  titulo_noticia: string;
  status: StatusSimulacao;
  progresso: number; // 0-100
  rounds_completados: number;
  agentes_count: number;
  iniciado_em: string;
  concluido_em: string | null;
  erro: string | null;
  world_base_id?: string | null;
  event_id?: string | null;
  mode?: string | null;
}

export interface SimulacaoRelatorioDTO {
  id: string;
  noticia_id: string;
  titulo_noticia: string;
  rounds_completados: number;
  agentes_count: number;
  relatorio_markdown: string;
  concluido_em: string;
  world_base_id?: string | null;
  event_id?: string | null;
  mode?: string | null;
}

export interface TriggerSimulacaoResponse {
  mensagem: string;
  simulacao_id: string;
  status: StatusSimulacao;
  mode: string;
  world_base_id: string;
  event_id: string;
}

// ─── Health ───────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  modelo_llm: string;
  ambiente: string;
  langfuse: boolean;
  scheduler_hora: number;
}
