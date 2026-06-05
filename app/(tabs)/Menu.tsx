// app/(tabs)/Menu.tsx
// ─────────────────────────────────────────────────────────────
// Tela de Relatórios — mostra um resumo financeiro com
// gráfico simples de barras e gastos por categoria.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';
import { CORES } from '../../src/config';

// Largura da tela para calcular o tamanho dos gráficos
const LARGURA_TELA = Dimensions.get('window').width - 40;

// ─────────────────────────────────────────────────────────────

export default function MenuScreen() {
  // Pega os dados do store global
  const { transacoes, totalReceitas, totalDespesas, saldo, totalPorCategoria } =
    useTransacoesStore();

  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();
  const categorias = totalPorCategoria();

  // Se há dinheiro disponível para metas (mínimo 0)
  const valorDisponivel = Math.max(saldoAtual, 0);

  // Percentual economizado em relação às receitas
  const percentualEconomia = receitas > 0 ? Math.round((saldoAtual / receitas) * 100) : 0;

  // Formata número para moeda brasileira
  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Cores para as categorias no gráfico
  const coresCategorias = [CORES.azul, CORES.verde, '#f59e0b', '#a855f7', CORES.vermelho];

  // ── Se não há transações, mostra uma mensagem ──
  const temDados = transacoes.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Título da página */}
        <Text style={styles.tituloPagina}>Relatórios</Text>

        {/* Mensagem quando não há dados */}
        {!temDados && (
          <View style={styles.caixaVazia}>
            <Text style={styles.emoticonVazio}>📊</Text>
            <Text style={styles.tituloVazio}>Nenhuma transação ainda</Text>
            <Text style={styles.subtituloVazio}>
              Adicione receitas e despesas nas outras abas para ver seus relatórios aqui.
            </Text>
          </View>
        )}

        {/* Conteúdo dos relatórios (só aparece se houver dados) */}
        {temDados && (
          <>
            {/* ── Cartões de Receita e Despesa ── */}
            <View style={styles.filhaCartoes}>
              <View style={styles.cartao}>
                <Text style={styles.labelCartao}>Receitas</Text>
                <Text style={[styles.valorCartao, { color: CORES.verde }]}>
                  {formatarMoeda(receitas)}
                </Text>
              </View>

              <View style={styles.cartao}>
                <Text style={styles.labelCartao}>Despesas</Text>
                <Text style={[styles.valorCartao, { color: CORES.vermelho }]}>
                  {formatarMoeda(despesas)}
                </Text>
              </View>
            </View>

            {/* ── Saldo do período ── */}
            <View style={[styles.cartao, { marginBottom: 20 }]}>
              <Text style={styles.labelCartao}>Saldo do período</Text>
              <Text style={[styles.valorCartaoGrande, { color: saldoAtual >= 0 ? CORES.verde : CORES.vermelho }]}>
                {saldoAtual >= 0 ? '+' : ''}{formatarMoeda(saldoAtual)}
              </Text>
              <Text style={styles.subtituloCartao}>
                Você economizou {percentualEconomia}% da sua renda
              </Text>
            </View>

            {/* ── Comparativo visual: Receita vs Despesa ── */}
            {receitas > 0 || despesas > 0 ? (
              <>
                <Text style={styles.tituloSecao}>RECEITAS VS DESPESAS</Text>
                <View style={styles.cartao}>
                  {/* Barra de receitas */}
                  <Text style={styles.labelBarra}>Receitas</Text>
                  <View style={styles.barraFundo}>
                    <View
                      style={[
                        styles.barraPreenchimento,
                        {
                          width: `${receitas > 0 ? 100 : 0}%`,
                          backgroundColor: CORES.verde,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.valorBarra, { color: CORES.verde }]}>{formatarMoeda(receitas)}</Text>

                  {/* Barra de despesas — proporcional às receitas */}
                  <Text style={[styles.labelBarra, { marginTop: 12 }]}>Despesas</Text>
                  <View style={styles.barraFundo}>
                    <View
                      style={[
                        styles.barraPreenchimento,
                        {
                          width: `${receitas > 0 ? Math.min((despesas / receitas) * 100, 100) : 0}%`,
                          backgroundColor: CORES.vermelho,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.valorBarra, { color: CORES.vermelho }]}>{formatarMoeda(despesas)}</Text>
                </View>
              </>
            ) : null}

            {/* ── Gastos por categoria ── */}
            {categorias.length > 0 && (
              <>
                <Text style={styles.tituloSecao}>GASTOS POR CATEGORIA</Text>
                <View style={styles.cartao}>
                  {categorias.map((cat, index) => {
                    // Calcula a porcentagem que essa categoria representa no total de despesas
                    const porcentagem = despesas > 0
                      ? Math.round((cat.total / despesas) * 100)
                      : 0;

                    const cor = coresCategorias[index % coresCategorias.length];

                    return (
                      <View key={cat.categoriaId} style={styles.linhaCategoria}>
                        {/* Bolinha colorida */}
                        <View style={[styles.bolinhaCategoria, { backgroundColor: cor }]} />

                        {/* Nome da categoria */}
                        <Text style={styles.nomeCategoria} numberOfLines={1}>
                          {cat.label}
                        </Text>

                        {/* Barra de progresso */}
                        <View style={styles.barraCategoria}>
                          <View style={[styles.barraPreenchimentoCat, { width: `${porcentagem}%`, backgroundColor: cor }]} />
                        </View>

                        {/* Valor gasto */}
                        <Text style={styles.valorCategoria}>{formatarMoeda(cat.total)}</Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // fundo claro para a tela de relatórios
  },
  scroll: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },

  // Título
  tituloPagina: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },

  // Estado vazio
  caixaVazia: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emoticonVazio: {
    fontSize: 48,
    marginBottom: 12,
  },
  tituloVazio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtituloVazio: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  // Filha de cartões
  filhaCartoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  // Cartão genérico
  cartao: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 0,
  },
  labelCartao: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 6,
  },
  valorCartao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  valorCartaoGrande: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtituloCartao: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },

  // Título de seção
  tituloSecao: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 8,
  },

  // Barras de comparativo
  labelBarra: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
  },
  barraFundo: {
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barraPreenchimento: {
    height: '100%',
    borderRadius: 5,
  },
  valorBarra: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },

  // Linha de categoria
  linhaCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#f3f4f6',
  },
  bolinhaCategoria: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nomeCategoria: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
  barraCategoria: {
    width: 60,
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barraPreenchimentoCat: {
    height: '100%',
    borderRadius: 3,
  },
  valorCategoria: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    width: 80,
    textAlign: 'right',
  },
});
