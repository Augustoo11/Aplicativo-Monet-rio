// app/(tabs)/Menu.tsx
// Relatórios — lê dados reais do store global

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';

const AZUL = '#3b82f6';
const VERDE = '#10b981';
const VERMELHO = '#ef4444';
const AMARELO = '#f59e0b';
const ROXO = '#a855f7';
const CINZA = '#9ca3af';

const CORES_CATEGORIA: Record<string, string> = {
  moradia: AZUL,
  alimentacao: VERMELHO,
  transporte: AMARELO,
  saude: VERDE,
  lazer: ROXO,
  educacao: '#06B6D4',
  entretenimento: '#F97316',
  outros: CINZA,
  salario: VERDE,
  freelance: AZUL,
  investimento: AMARELO,
  presente: ROXO,
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 40;

const METAS = [
  { name: 'Reserva de emergência', current: 12000, target: 20000, color: VERDE },
  { name: 'Viagem Europa', current: 4500, target: 15000, color: AZUL },
  { name: 'Notebook novo', current: 2800, target: 4000, color: AMARELO },
];

const fmt = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtK = (v: number) =>
  v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`;

// ─── Gráfico de barras ────────────────────────────────────────────────────────

function GraficoBarras({ barras }: { barras: { label: string; receita: number; despesa: number }[] }) {
  const maxVal = Math.max(...barras.map(b => Math.max(b.receita, b.despesa)), 1);
  const ALTURA = 160;
  const barWidth = Math.floor((CHART_WIDTH - 48) / barras.length / 2) - 2;

  return (
    <View>
      <View style={{ height: ALTURA, justifyContent: 'space-between', marginBottom: 4 }}>
        {[100, 75, 50, 25, 0].map(pct => (
          <View key={pct} style={styles.regraLinha}>
            <Text style={styles.regraTexto}>{fmtK(Math.round(maxVal * pct / 100))}</Text>
            <View style={styles.regraTracado} />
          </View>
        ))}
      </View>
      <View style={[styles.barrasContainer, { height: ALTURA, marginTop: -ALTURA - 4 }]}>
        {barras.map((b, i) => {
          const altReceita = (b.receita / maxVal) * ALTURA;
          const altDespesa = (b.despesa / maxVal) * ALTURA;
          return (
            <View key={i} style={styles.barraGrupo}>
              <View style={styles.barrasPar}>
                <View style={[styles.barra, { height: altReceita, width: barWidth, backgroundColor: VERDE }]} />
                <View style={[styles.barra, { height: altDespesa, width: barWidth, backgroundColor: VERMELHO }]} />
              </View>
              <Text style={styles.barraLabel}>{b.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Gráfico de linha ─────────────────────────────────────────────────────────

function GraficoLinha({ valores }: { valores: number[] }) {
  const ALTURA = 120;
  const LARGURA = CHART_WIDTH - 80;
  const maxVal = Math.max(...valores, 1);
  const minVal = Math.min(...valores);
  const range = maxVal - minVal || 1;

  const pontos = valores.map((v, i) => ({
    x: valores.length > 1 ? (i / (valores.length - 1)) * LARGURA : LARGURA / 2,
    y: ALTURA - ((v - minVal) / range) * ALTURA,
  }));

  return (
    <View style={{ paddingLeft: 40 }}>
      <View style={[StyleSheet.absoluteFillObject, { width: 38, justifyContent: 'space-between', paddingVertical: 4 }]}>
        {[maxVal, Math.round((maxVal + minVal) / 2), minVal].map((v, i) => (
          <Text key={i} style={[styles.regraTexto, { textAlign: 'right', width: 36, marginLeft: -38 }]}>
            {fmtK(v)}
          </Text>
        ))}
      </View>
      <View style={{ height: ALTURA + 20, width: LARGURA }}>
        {[0, 0.5, 1].map((pct, i) => (
          <View key={i} style={[styles.regraTracado, { position: 'absolute', top: pct * ALTURA, width: LARGURA }]} />
        ))}
        {pontos.slice(0, -1).map((p, i) => {
          const p2 = pontos[i + 1];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const comprimento = Math.sqrt(dx * dx + dy * dy);
          const angulo = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View key={i} style={{
              position: 'absolute', left: p.x, top: p.y,
              width: comprimento, height: 2,
              backgroundColor: AZUL, borderRadius: 1,
              transform: [{ rotate: `${angulo}deg` }],
            }} />
          );
        })}
        {pontos.map((p, i) => (
          <View key={i} style={{
            position: 'absolute', left: p.x - 4, top: p.y - 4,
            width: 8, height: 8, borderRadius: 4,
            backgroundColor: AZUL, borderWidth: 2, borderColor: '#fff',
          }} />
        ))}
      </View>
    </View>
  );
}

// ─── Gráfico de rosca ─────────────────────────────────────────────────────────

function GraficoRosca({ segmentos }: { segmentos: { pct: number; color: string }[] }) {
  return (
    <View style={styles.roscaContainer}>
      {segmentos.map((s, i) => (
        <View key={i} style={[styles.roscaSegmento, { flex: s.pct, backgroundColor: s.color }]} />
      ))}
    </View>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function CardResumo({ label, valor, delta, cor, wide }: {
  label: string; valor: string; delta?: string; cor?: string; wide?: boolean;
}) {
  return (
    <View style={[styles.cardResumo, wide && { flex: undefined, width: '100%' }]}>
      <Text style={styles.cardResumoLabel}>{label}</Text>
      <Text style={[styles.cardResumoValor, cor ? { color: cor } : {}]}>{valor}</Text>
      {delta ? <Text style={[styles.cardResumoDelta, { color: cor }]}>{delta}</Text> : null}
    </View>
  );
}

function LinhaMeta({ meta }: { meta: typeof METAS[0] }) {
  const pct = Math.round((meta.current / meta.target) * 100);
  return (
    <View style={styles.linhaMeta}>
      <View style={styles.metaHeader}>
        <Text style={styles.metaNome}>{meta.name}</Text>
        <Text style={[styles.metaPct, { color: meta.color }]}>{pct}%</Text>
      </View>
      <View style={styles.metaBarraFundo}>
        <View style={[styles.metaBarraFill, { width: `${pct}%`, backgroundColor: meta.color }]} />
      </View>
      <View style={styles.metaRodape}>
        <Text style={styles.metaAmt}>{fmt(meta.current)} guardados</Text>
        <Text style={styles.metaAmt}>Meta: {fmt(meta.target)}</Text>
      </View>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function MenuScreen() {
  const { transacoes, totalReceitas, totalDespesas, saldo, totalPorCategoria } = useTransacoesStore();

  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();
  const economiaPct = receitas > 0 ? Math.round((saldoAtual / receitas) * 100) : 0;
  const categorias = totalPorCategoria();
  const totalDespesasCateg = despesas || 1;
  const temDados = transacoes.length > 0;

  // Monta barras dos últimos 6 meses com dados reais agrupados por mês
  const barrasPorMes = (() => {
    const meses: Record<string, { receita: number; despesa: number }> = {};
    transacoes.forEach(t => {
      const chave = t.data.toLocaleString('pt-BR', { month: 'short' });
      if (!meses[chave]) meses[chave] = { receita: 0, despesa: 0 };
      if (t.tipo === 'receita') meses[chave].receita += t.valor;
      else meses[chave].despesa += t.valor;
    });
    const resultado = Object.entries(meses).map(([label, v]) => ({ label, ...v }));
    return resultado.length > 0
      ? resultado
      : [{ label: 'Agora', receita: 0, despesa: 0 }];
  })();

  // Linha de saldo acumulado
  const linhaAcumulada = (() => {
    let acum = 0;
    const linha = transacoes
      .slice()
      .reverse()
      .map(t => {
        acum += t.tipo === 'receita' ? t.valor : -t.valor;
        return acum;
      });
    return linha.length > 1 ? linha : [0, saldoAtual];
  })();

  const segmentosRosca = categorias.slice(0, 5).map(c => ({
    pct: despesas > 0 ? Math.round((c.total / despesas) * 100) : 0,
    color: CORES_CATEGORIA[c.categoriaId] ?? CINZA,
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.tituloPagina}>Relatórios</Text>

        {!temDados && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitulo}>Nenhuma transação ainda</Text>
            <Text style={styles.emptySubtitulo}>
              Adicione receitas e despesas na aba central para ver seus relatórios aqui.
            </Text>
          </View>
        )}

        {temDados && (
          <>
            {/* Cards resumo */}
            <View style={styles.resumoGrid}>
              <CardResumo label="Receitas" valor={fmt(receitas)} cor={VERDE} />
              <CardResumo label="Despesas" valor={fmt(despesas)} cor={VERMELHO} />
            </View>
            <View style={{ marginBottom: 20 }}>
              <CardResumo
                label="Saldo do período"
                valor={`${saldoAtual >= 0 ? '+' : ''} ${fmt(saldoAtual)}`}
                delta={`Economia de ${economiaPct}% da renda`}
                cor={saldoAtual >= 0 ? VERDE : VERMELHO}
                wide
              />
            </View>

            {/* Receitas vs Despesas */}
            <Text style={styles.secaoLabel}>Receitas vs Despesas</Text>
            <View style={styles.card}>
              <View style={styles.legenda}>
                {[{ label: 'Receitas', color: VERDE }, { label: 'Despesas', color: VERMELHO }].map(l => (
                  <View key={l.label} style={styles.legendaItem}>
                    <View style={[styles.legendaQuadrado, { backgroundColor: l.color }]} />
                    <Text style={styles.legendaTexto}>{l.label}</Text>
                  </View>
                ))}
              </View>
              <GraficoBarras barras={barrasPorMes} />
            </View>

            {/* Saldo acumulado */}
            <Text style={styles.secaoLabel}>Saldo acumulado</Text>
            <View style={styles.card}>
              <GraficoLinha valores={linhaAcumulada} />
            </View>

            {/* Gastos por categoria */}
            {categorias.length > 0 && (
              <>
                <Text style={styles.secaoLabel}>Gastos por categoria</Text>
                <View style={styles.card}>
                  <View style={styles.pieResumo}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardResumoLabel}>Total gasto</Text>
                      <Text style={[styles.cardResumoValor, { fontSize: 22 }]}>{fmt(despesas)}</Text>
                    </View>
                  </View>
                  <GraficoRosca segmentos={segmentosRosca} />
                  <View style={{ marginTop: 16 }}>
                    {categorias.map(cat => {
                      const pct = Math.round((cat.total / totalDespesasCateg) * 100);
                      const cor = CORES_CATEGORIA[cat.categoriaId] ?? CINZA;
                      return (
                        <View key={cat.categoriaId} style={styles.linhaCategoria}>
                          <View style={[styles.catPonto, { backgroundColor: cor }]} />
                          <Text style={styles.catNome}>{cat.emoji} {cat.label}</Text>
                          <View style={styles.catBarraFundo}>
                            <View style={[styles.catBarraFill, { width: `${pct}%`, backgroundColor: cor }]} />
                          </View>
                          <Text style={styles.catValor}>{fmt(cat.total)}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </>
            )}
          </>
        )}

        {/* Metas — sempre visíveis */}
        <Text style={styles.secaoLabel}>Metas financeiras</Text>
        <View style={[styles.card, { marginBottom: 32 }]}>
          {METAS.map(meta => <LinhaMeta key={meta.name} meta={meta} />)}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  scroll: { padding: 20, paddingTop: 16 },

  tituloPagina: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },

  emptyState: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#fff', borderRadius: 16, marginBottom: 20 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitulo: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  emptySubtitulo: { fontSize: 14, color: '#9ca3af', textAlign: 'center', paddingHorizontal: 24 },

  resumoGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  cardResumo: { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  cardResumoLabel: { fontSize: 11, color: '#9ca3af', marginBottom: 6 },
  cardResumoValor: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  cardResumoDelta: { fontSize: 11, marginTop: 4 },

  secaoLabel: { fontSize: 11, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  card: { backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb', padding: 16, marginBottom: 20 },

  legenda: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendaQuadrado: { width: 10, height: 10, borderRadius: 2 },
  legendaTexto: { fontSize: 12, color: '#6b7280' },

  regraLinha: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  regraTexto: { fontSize: 9, color: '#9ca3af', width: 32 },
  regraTracado: { flex: 1, height: 0.5, backgroundColor: '#e5e7eb' },
  barrasContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 36 },
  barraGrupo: { flex: 1, alignItems: 'center' },
  barrasPar: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  barra: { borderRadius: 3 },
  barraLabel: { fontSize: 9, color: '#9ca3af', marginTop: 4, textAlign: 'center' },

  linhaCategoria: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, borderTopWidth: 0.5, borderTopColor: '#f3f4f6' },
  catPonto: { width: 10, height: 10, borderRadius: 5 },
  catNome: { flex: 1, fontSize: 13, color: '#374151' },
  catBarraFundo: { width: 60, height: 5, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  catBarraFill: { height: '100%', borderRadius: 3 },
  catValor: { fontSize: 12, fontWeight: '600', color: '#1f2937', minWidth: 80, textAlign: 'right' },

  roscaContainer: { flexDirection: 'row', height: 16, borderRadius: 8, overflow: 'hidden', marginBottom: 4 },
  roscaSegmento: { height: '100%' },
  pieResumo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },

  linhaMeta: { paddingVertical: 12, borderTopWidth: 0.5, borderTopColor: '#f3f4f6' },
  metaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metaNome: { fontSize: 14, color: '#1f2937' },
  metaPct: { fontSize: 13, fontWeight: '600' },
  metaBarraFundo: { height: 6, backgroundColor: '#f3f4f6', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  metaBarraFill: { height: '100%', borderRadius: 4 },
  metaRodape: { flexDirection: 'row', justifyContent: 'space-between' },
  metaAmt: { fontSize: 11, color: '#9ca3af' },
});
