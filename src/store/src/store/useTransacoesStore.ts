// src/store/useTransacoesStore.ts
// ─────────────────────────────────────────────────────────────
// Store global de transações usando Zustand.
// Guarda as transações na memória enquanto o app está aberto.
// Toda tela do app acessa os dados por aqui.
// ─────────────────────────────────────────────────────────────

import { create } from 'zustand';

// Formato de uma transação dentro do app
type Transacao = {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  valorFormatado: string; // ex: "R$ 150,00"
  categoriaId: string;
  categoriaLabel: string; // ex: "Alimentação"
  descricao: string;
  data: Date;
};

// Formato resumido de gastos por categoria (usado nos relatórios)
type ResumoPorCategoria = {
  categoriaId: string;
  label: string;
  total: number;
};

// Tudo que o store oferece para as telas do app
type Store = {
  transacoes: Transacao[];

  // Substitui todas as transações (usado ao buscar do banco)
  setTransacoesDoBanco: (novas: Transacao[]) => void;

  // Apaga tudo (usado ao fazer logout)
  limparTransacoes: () => void;

  // Calcula o total de receitas
  totalReceitas: () => number;

  // Calcula o total de despesas
  totalDespesas: () => number;

  // Calcula o saldo (receitas - despesas)
  saldo: () => number;

  // Agrupa despesas por categoria (para os relatórios)
  totalPorCategoria: () => ResumoPorCategoria[];
};

export const useTransacoesStore = create<Store>((set, get) => ({
  transacoes: [],

  // Salva a lista de transações vinda do banco
  setTransacoesDoBanco: (novas) => set({ transacoes: novas }),

  // Apaga todas as transações da memória
  limparTransacoes: () => set({ transacoes: [] }),

  // Soma todos os valores de receita
  totalReceitas: () =>
    get()
      .transacoes.filter((t) => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0),

  // Soma todos os valores de despesa
  totalDespesas: () =>
    get()
      .transacoes.filter((t) => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0),

  // Saldo = receitas - despesas
  saldo: () => get().totalReceitas() - get().totalDespesas(),

  // Agrupa despesas por categoria e ordena da maior para a menor
  totalPorCategoria: () => {
    // Junta todas as despesas agrupando por categoria
    const grupos: Record<string, ResumoPorCategoria> = {};

    get()
      .transacoes.filter((t) => t.tipo === 'despesa')
      .forEach((t) => {
        if (!grupos[t.categoriaId]) {
          grupos[t.categoriaId] = {
            categoriaId: t.categoriaId,
            label: t.categoriaLabel,
            total: 0,
          };
        }
        grupos[t.categoriaId].total += t.valor;
      });

    // Transforma o objeto em array e ordena do maior para o menor
    return Object.values(grupos).sort((a, b) => b.total - a.total);
  },
}));
