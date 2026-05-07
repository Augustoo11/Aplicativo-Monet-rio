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

  adicionarTransacao: (transacao: NovaTransacao) => void;
  removerTransacao: (id: string) => void;
  ultimasTransacoes: (limite?: number) => Transacao[];
  totalPorCategoria: () => CategoriaResumo[];

  totalReceitas: () => number;
  totalDespesas: () => number;
  saldo: () => number;
};

export const useTransacoesStore = create<Store>((set, get) => ({
  transacoes: [],

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
      transacoes: state.transacoes.filter((t) => t.id !== id),
    })),

  ultimasTransacoes: (limite = 10) =>
    get().transacoes.slice(-limite),

  totalPorCategoria: () => {
    const categorias = get().transacoes
      .filter((t) => t.tipo === 'despesa')
      .reduce<Record<string, CategoriaResumo>>((acc, transacao) => {
        const key = transacao.categoriaId;
        if (!acc[key]) {
          acc[key] = {
            categoriaId: transacao.categoriaId,
            label: transacao.categoriaLabel,
            emoji: transacao.emoji,
            total: 0,
          };
        }
        acc[key].total += transacao.valor;
        return acc;
      }, {});

    return Object.values(categorias).sort((a, b) => b.total - a.total);
  },

  totalReceitas: () =>
    get()
      .transacoes
      .filter((t) => t.tipo === 'receita')
      .reduce((acc, t) => acc + t.valor, 0),

  totalDespesas: () =>
    get()
      .transacoes
      .filter((t) => t.tipo === 'despesa')
      .reduce((acc, t) => acc + t.valor, 0),

  saldo: () =>
    get().totalReceitas() - get().totalDespesas(),
}));