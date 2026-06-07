// src/store/src/store/useTransacoesStore.ts
// Store global de transações.
//
// ✅ REGRA DO SALDO:
//   saldo = receitas - despesas normais - despesas de meta
//   Ou seja: despesas de meta SÃO descontadas do saldo disponível.
//   A diferença é só visual: na tela elas aparecem em AMARELO,
//   enquanto despesas normais aparecem em VERMELHO.

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
  ehMeta: boolean;   // true = despesa vinculada a uma meta (amarela)
  metaId: number | null;
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
  totalDespesas: () => number; // inclui normais + de meta
  saldo: () => number;         // receitas - todas as despesas
  totalPorCategoria: () => ResumoPorCategoria[];
};

export const useTransacoesStore = create<Store>((set, get) => ({
  transacoes: [],

  setTransacoesDoBanco: (novas) => set({ transacoes: novas }),

  limparTransacoes: () => set({ transacoes: [] }),

  // Soma de todas as receitas
  totalReceitas: () =>
    get()
      .transacoes.filter((t) => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0),

  // ✅ Soma TODAS as despesas (normais + de meta)
  // Despesas de meta reduzem o saldo disponível, assim como as normais.
  // A diferença entre elas é apenas a cor na tela (vermelho vs amarelo).
  totalDespesas: () =>
    get()
      .transacoes.filter((t) => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0),

  // Saldo = receitas - todas as despesas
  saldo: () => get().totalReceitas() - get().totalDespesas(),

  // Agrupa despesas normais por categoria (para os relatórios)
  // Despesas de meta não entram no agrupamento por categoria
  totalPorCategoria: () => {
    const grupos: Record<string, ResumoPorCategoria> = {};

    get()
      .transacoes.filter((t) => t.tipo === 'despesa' && !t.ehMeta)
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
