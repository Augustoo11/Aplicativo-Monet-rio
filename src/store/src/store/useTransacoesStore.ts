// src/store/useTransacoesStore.ts
// Store global de transações usando Zustand.
// Guarda todas as transações na memória e calcula receitas, despesas e saldo.

import { create } from 'zustand';

type Transacao = {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  valorFormatado: string;
  categoriaId: string;
  categoriaLabel: string;
  descricao: string;
  data: Date;
  ehMeta: boolean;
  metaId: string | null;
};

type ResumoPorCategoria = {
  categoriaId: string;
  label: string;
  total: number;
};

type Store = {
  transacoes: Transacao[];
  setTransacoesDoBanco: (novas: Transacao[]) => void;
  limparTransacoes: () => void;
  totalReceitas: () => number;
  totalDespesas: () => number;
  saldo: () => number;
  totalPorCategoria: () => ResumoPorCategoria[];
};

export const useTransacoesStore = create<Store>((set, get) => ({
  transacoes: [],

  setTransacoesDoBanco: (novas) => set({ transacoes: novas }),

  limparTransacoes: () => set({ transacoes: [] }),

  totalReceitas: () =>
    get().transacoes
      .filter((t) => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0),

  totalDespesas: () =>
    get().transacoes
      .filter((t) => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0),

  saldo: () => get().totalReceitas() - get().totalDespesas(),

  totalPorCategoria: () => {
    const grupos: Record<string, ResumoPorCategoria> = {};

    get().transacoes
      .filter((t) => t.tipo === 'despesa' && !t.ehMeta)
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

    return Object.values(grupos).sort((a, b) => b.total - a.total);
  },
}));
