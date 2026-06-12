// src/store/src/store/useTransacoesStore.ts
// Store global de transações (usando Zustand)
//
// O QUE ESSE ARQUIVO FAZ:
//   - Guarda todas as transações do usuário na memória
//   - Calcula o total de receitas, despesas e saldo
//
// REGRA DO SALDO:
//   saldo = receitas - TODAS as despesas (normais + de meta)
//
//   A diferença entre despesa normal e despesa de meta é APENAS visual:
//   - Despesa de meta  → aparece em AMARELO na tela
//   - Despesa normal   → aparece em VERMELHO na tela
//   Ambas reduzem o saldo disponível da mesma forma.

import { create } from 'zustand';

// Tipo de uma transação no store
type Transacao = {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  valorFormatado: string;
  categoriaId: string;
  categoriaLabel: string;
  descricao: string;
  data: Date;
  ehMeta: boolean;        // true = despesa de meta (amarela), false = normal (vermelha)
  metaId: number | null;  // ID da meta vinculada (só quando ehMeta = true)
};

// Tipo para agrupar despesas por categoria
type ResumoPorCategoria = {
  categoriaId: string;
  label: string;
  total: number;
};

// Tipo do store completo
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
  // Lista de transações — começa vazia
  transacoes: [],

  // Substitui a lista de transações com os dados do banco
  setTransacoesDoBanco: (novas) => set({ transacoes: novas }),

  // Limpa tudo (usado no logout)
  limparTransacoes: () => set({ transacoes: [] }),

  // Soma de todas as receitas
  totalReceitas: () =>
    get()
      .transacoes
      .filter((t) => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0),

  // Soma de TODAS as despesas (normais + de meta)
  // Despesas de meta reduzem o saldo tanto quanto as normais.
  // A única diferença é a cor que aparece na tela.
  totalDespesas: () =>
    get()
      .transacoes
      .filter((t) => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0),

  // Saldo = receitas - todas as despesas
  saldo: () => get().totalReceitas() - get().totalDespesas(),

  // Agrupa as despesas NORMAIS por categoria (para relatórios)
  // Despesas de meta não entram nesse agrupamento
  totalPorCategoria: () => {
    const grupos: Record<string, ResumoPorCategoria> = {};

    get()
      .transacoes
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

    // Retorna ordenado do maior para o menor
    return Object.values(grupos).sort((a, b) => b.total - a.total);
  },
}));
