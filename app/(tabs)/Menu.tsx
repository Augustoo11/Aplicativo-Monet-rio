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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';
import { CORES } from '../../src/config';
import { estilosMenu } from '../../src/styles/estilosMenu';

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
    <SafeAreaView style={estilosMenu.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosMenu.scroll}>

        {/* Título da página */}
        <Text style={estilosMenu.tituloPagina}>Relatórios</Text>

        {/* Mensagem quando não há dados */}
        {!temDados && (
          <View style={estilosMenu.caixaVazia}>
            <Text style={estilosMenu.emoticonVazio}>📊</Text>
            <Text style={estilosMenu.tituloVazio}>Nenhuma transação ainda</Text>
            <Text style={estilosMenu.subtituloVazio}>
              Adicione receitas e despesas nas outras abas para ver seus relatórios aqui.
            </Text>
          </View>
        )}

        {/* Conteúdo dos relatórios (só aparece se houver dados) */}
        {temDados && (
          <>
            {/* ── Cartões de Receita e Despesa ── */}
            <View style={estilosMenu.filhaCartoes}>
              <View style={estilosMenu.cartao}>
                <Text style={estilosMenu.labelCartao}>Receitas</Text>
                <Text style={[estilosMenu.valorCartao, { color: CORES.verde }]}>
                  {formatarMoeda(receitas)}
                </Text>
              </View>

              <View style={estilosMenu.cartao}>
                <Text style={estilosMenu.labelCartao}>Despesas</Text>
                <Text style={[estilosMenu.valorCartao, { color: CORES.vermelho }]}>
                  {formatarMoeda(despesas)}
                </Text>
              </View>
            </View>

            {/* ── Saldo do período ── */}
            <View style={[estilosMenu.cartao, { marginBottom: 20 }]}>
              <Text style={estilosMenu.labelCartao}>Saldo do período</Text>
              <Text style={[estilosMenu.valorCartaoGrande, { color: saldoAtual >= 0 ? CORES.verde : CORES.vermelho }]}>
                {saldoAtual >= 0 ? '+' : ''}{formatarMoeda(saldoAtual)}
              </Text>
              <Text style={estilosMenu.subtituloCartao}>
                Você economizou {percentualEconomia}% da sua renda
              </Text>
            </View>

            {/* ── Comparativo visual: Receita vs Despesa ── */}
            {receitas > 0 || despesas > 0 ? (
              <>
                <Text style={estilosMenu.tituloSecao}>RECEITAS VS DESPESAS</Text>
                <View style={estilosMenu.cartao}>
                  {/* Barra de receitas */}
                  <Text style={estilosMenu.labelBarra}>Receitas</Text>
                  <View style={estilosMenu.barraFundo}>
                    <View
                      style={[
                        estilosMenu.barraPreenchimento,
                        {
                          width: `${receitas > 0 ? 100 : 0}%`,
                          backgroundColor: CORES.verde,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[estilosMenu.valorBarra, { color: CORES.verde }]}>{formatarMoeda(receitas)}</Text>

                  {/* Barra de despesas — proporcional às receitas */}
                  <Text style={[estilosMenu.labelBarra, { marginTop: 12 }]}>Despesas</Text>
                  <View style={estilosMenu.barraFundo}>
                    <View
                      style={[
                        estilosMenu.barraPreenchimento,
                        {
                          width: `${receitas > 0 ? Math.min((despesas / receitas) * 100, 100) : 0}%`,
                          backgroundColor: CORES.vermelho,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[estilosMenu.valorBarra, { color: CORES.vermelho }]}>{formatarMoeda(despesas)}</Text>
                </View>
              </>
            ) : null}

            {/* ── Gastos por categoria ── */}
            {categorias.length > 0 && (
              <>
                <Text style={estilosMenu.tituloSecao}>GASTOS POR CATEGORIA</Text>
                <View style={estilosMenu.cartao}>
                  {categorias.map((cat, index) => {
                    // Calcula a porcentagem que essa categoria representa no total de despesas
                    const porcentagem = despesas > 0
                      ? Math.round((cat.total / despesas) * 100)
                      : 0;

                    const cor = coresCategorias[index % coresCategorias.length];

                    return (
                      <View key={cat.categoriaId} style={estilosMenu.linhaCategoria}>
                        {/* Bolinha colorida */}
                        <View style={[estilosMenu.bolinhaCategoria, { backgroundColor: cor }]} />

                        {/* Nome da categoria */}
                        <Text style={estilosMenu.nomeCategoria} numberOfLines={1}>
                          {cat.label}
                        </Text>

                        {/* Barra de progresso */}
                        <View style={estilosMenu.barraCategoria}>
                          <View style={[estilosMenu.barraPreenchimentoCat, { width: `${porcentagem}%`, backgroundColor: cor }]} />
                        </View>

                        {/* Valor gasto */}
                        <Text style={estilosMenu.valorCategoria}>{formatarMoeda(cat.total)}</Text>
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
