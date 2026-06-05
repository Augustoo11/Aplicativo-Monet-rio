// src/config.ts
// ─────────────────────────────────────────────────────────────
// Aqui ficam as configurações globais do app.
// Troque a URL abaixo pela URL do seu Codespace (porta 8080).
// ─────────────────────────────────────────────────────────────

// URL do backend Spring Boot
// ⚠️ Não coloque barra "/" no final!
export const API_URL = 'https://fuzzy-invention-w9xpq4vv94h5j44-8080.app.github.dev';

// Lista de categorias de DESPESA que aparecem no app
// Esses nomes precisam existir no banco de dados!
export const CATEGORIAS_DESPESA = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Outros gastos',
];

// Lista de categorias de RECEITA que aparecem no app
// Esses nomes precisam existir no banco de dados!
export const CATEGORIAS_RECEITA = [
  'Salário',
  'Freelance',
  'Outras receitas',
];

// Cores principais do app (tema escuro)
export const CORES = {
  fundo: '#0F172A',       // fundo principal (azul bem escuro)
  cartao: '#1E293B',      // fundo dos cartões
  borda: '#334155',       // cor das bordas
  textoClaro: '#FFFFFF',  // texto branco
  textoMedio: '#94A3B8',  // texto cinza claro
  textoEscuro: '#64748B', // texto cinza escuro
  azul: '#3B82F6',        // azul principal (botões, seleção)
  verde: '#22C55E',       // verde (receitas)
  vermelho: '#EF4444',    // vermelho (despesas)
};
