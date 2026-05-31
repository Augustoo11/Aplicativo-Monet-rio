import { create } from 'zustand';

type TipoTransacao = 'receita' | 'despesa';

type Transacao = {
  id: string;
  tipo: TipoTransacao;
  valor: number;
  valorFormatado: string;
  categoriaId: string;
  categoriaLabel: string;
  emoji: string;
  data: Date;
};

type CategoriaResumo = {
  categoriaId: string;
  label: string;
  emoji: string;
  total: number;
};

type NovaTransacao = Omit<Transacao, 'id' | 'data'>;

type Store = {
  transacoes: Transacao[];

  // ─── Ações de Sync e Reset ───
  setTransacoesDoBanco: (novasTransacoes: Transacao[]) => void;
  limparTransacoes: () => void;

  // ─── Ações CRUD ───
  adicionarTransacao: (transacao: NovaTransacao) => void;
  removerTransacao: (id: string) => void;

  // ─── Getters / Cálculos ───
  ultimasTransacoes: (limite?: number) => Transacao[];
  totalPorCategoria: () => CategoriaResumo[];
  totalReceitas: () => number;
  totalDespesas: () => number;
  saldo: () => number;
};

export const useTransacoesStore = create<Store>((set, get) => ({
  transacoes: [],

  // ─── Implementação das Ações ───
  setTransacoesDoBanco: (novasTransacoes) => set({ transacoes: novasTransacoes }),
  
  limparTransacoes: () => set({ transacoes: [] }),

  adicionarTransacao: (transacao) =>
    set((state) => ({
      transacoes: [
        ...state.transacoes,
        {
          ...transacao,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          data: new Date(),
        },
      ],
    })),

  removerTransacao: (id) =>
    set((state) => ({
      transacoes: state.transacoes.filter((item) => item.id !== id),
    })),

  ultimasTransacoes: (limite = 10) =>
    get().transacoes.slice(-limite),

  totalPorCategoria: () => {
    const categorias = get()
      .transacoes.filter((item) => item.tipo === 'despesa')
      .reduce<Record<string, CategoriaResumo>>((acc, item) => {
        const key = item.categoriaId;
        if (!acc[key]) {
          acc[key] = {
            categoriaId: item.categoriaId,
            label: item.categoriaLabel,
            emoji: item.emoji,
            total: 0,
          };
        }
        acc[key].total += item.valor;
        return acc;
      }, {});

    return Object.values(categorias).sort((a, b) => b.total - a.total);
  },

  totalReceitas: () =>
    get()
      .transacoes.filter((item) => item.tipo === 'receita')
      .reduce((acc, item) => acc + item.valor, 0),

  totalDespesas: () =>
    get()
      .transacoes.filter((item) => item.tipo === 'despesa')
      .reduce((acc, item) => acc + item.valor, 0),

  saldo: () => get().totalReceitas() - get().totalDespesas(),
}));