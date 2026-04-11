// app/(tabs)/Menu.tsx
// Gráficos feitos 100% com React Native puro — sem dependências externas

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { estilosGlobais } from '../../src/componentes/estilosGlobais';

const AZUL = '#3b82f6';
const VERDE = '#10b981';
const VERMELHO = '#ef4444';
const AMARELO = '#f59e0b';
const ROXO = '#a855f7';
const CINZA = '#9ca3af';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 40;

// ─── Tipos e dados mock ───────────────────────────────────────────────────────

type Periodo = '7D' | 'Mês' | '3M' | 'Ano';

const DADOS: Record<Periodo, {
  receitas: number;
  despesas: number;
  saldo: number;
  deltaPct: number;
  barras: { label: string; receita: number; despesa: number }[];
  linha: number[];
}> = {
  '7D': {
    receitas: 2100, despesas: 1300, saldo: 800, deltaPct: 5,
    barras: [
      { label: 'Seg', receita: 300, despesa: 200 },
      { label: 'Ter', receita: 280, despesa: 180 },
      { label: 'Qua', receita: 320, despesa: 210 },
      { label: 'Qui', receita: 400, despesa: 250 },
      { label: 'Sex', receita: 350, despesa: 220 },
      { label: 'Sáb', receita: 250, despesa: 130 },
      { label: 'Dom', receita: 200, despesa: 110 },
    ],
    linha: [1200, 1400, 1600, 1350, 1700, 1900, 2100],
  },
  'Mês': {
    receitas: 8450, despesas: 5218, saldo: 3232, deltaPct: 12,
    barras: [
      { label: 'Nov', receita: 7200, despesa: 4900 },
      { label: 'Dez', receita: 7800, despesa: 5400 },
      { label: 'Jan', receita: 8100, despesa: 4700 },
      { label: 'Fev', receita: 7600, despesa: 5100 },
      { label: 'Mar', receita: 8000, despesa: 5000 },
      { label: 'Abr', receita: 8450, despesa: 5218 },
    ],
    linha: [1200, 4200, 7600, 10200, 13200, 16432],
  },
  '3M': {
    receitas: 24050, despesas: 15318, saldo: 8732, deltaPct: 8,
    barras: [
      { label: 'Fev', receita: 7600, despesa: 5100 },
      { label: 'Mar', receita: 8000, despesa: 5000 },
      { label: 'Abr', receita: 8450, despesa: 5218 },
    ],
    linha: [5000, 8200, 12000, 16732],
  },
  'Ano': {
    receitas: 98400, despesas: 62000, saldo: 36400, deltaPct: 18,
    barras: [
      { label: 'Jan', receita: 8100, despesa: 4700 },
      { label: 'Mar', receita: 8000, despesa: 5000 },
      { label: 'Mai', receita: 8800, despesa: 5300 },
      { label: 'Jul', receita: 9200, despesa: 5100 },
      { label: 'Set', receita: 8600, despesa: 5200 },
      { label: 'Dez', receita: 7200, despesa: 4900 },
    ],
    linha: [4200, 8400, 13800, 20100, 26800, 36400],
  },
};

const CATEGORIAS = [
  { name: 'Moradia',      valor: 1800, pct: 35, color: AZUL },
  { name: 'Alimentação',  valor: 1040, pct: 20, color: VERMELHO },
  { name: 'Transporte',   valor: 782,  pct: 15, color: AMARELO },
  { name: 'Saúde',        valor: 522,  pct: 10, color: VERDE },
  { name: 'Lazer',        valor: 470,  pct: 9,  color: ROXO },
  { name: 'Outros',       valor: 604,  pct: 11, color: CINZA },
];

const METAS = [
  { name: 'Reserva de emergência', current: 12000, target: 20000, color: VERDE },
  { name: 'Viagem Europa',         current: 4500,  target: 15000, color: AZUL },
  { name: 'Notebook novo',         current: 2800,  target: 4000,  color: AMARELO },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtK = (v: number) =>
  v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`;

// ─── Gráfico de barras customizado ────────────────────────────────────────────

function GraficoBarras({ barras }: { barras: { label: string; receita: number; despesa: number }[] }) {
  const maxVal = Math.max(...barras.map(b => Math.max(b.receita, b.despesa)));
  const ALTURA = 160;
  const barWidth = Math.floor((CHART_WIDTH - 48) / barras.length / 2) - 2;

  return (
    <View>
      {/* Linhas de referência */}
      <View style={{ height: ALTURA, justifyContent: 'space-between', marginBottom: 4 }}>
        {[100, 75, 50, 25, 0].map(pct => (
          <View key={pct} style={styles.regraLinha}>
            <Text style={styles.regraTexto}>{fmtK(Math.round(maxVal * pct / 100))}</Text>
            <View style={styles.regraTracado} />
          </View>
        ))}
      </View>

      {/* Barras */}
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

// ─── Gráfico de linha customizado ─────────────────────────────────────────────

function GraficoLinha({ valores }: { valores: number[] }) {
  const ALTURA = 120;
  const LARGURA = CHART_WIDTH - 80;
  const maxVal = Math.max(...valores);
  const minVal = Math.min(...valores);
  const range = maxVal - minVal || 1;

  const pontos = valores.map((v, i) => ({
    x: (i / (valores.length - 1)) * LARGURA,
    y: ALTURA - ((v - minVal) / range) * ALTURA,
  }));

  return (
    <View style={{ paddingLeft: 40 }}>
      {/* Labels eixo Y */}
      <View style={[StyleSheet.absoluteFillObject, { width: 38, justifyContent: 'space-between', paddingVertical: 4 }]}>
        {[maxVal, Math.round((maxVal + minVal) / 2), minVal].map((v, i) => (
          <Text key={i} style={[styles.regraTexto, { textAlign: 'right', width: 36, marginLeft: -38 }]}>
            {fmtK(v)}
          </Text>
        ))}
      </View>

      {/* Área do gráfico */}
      <View style={{ height: ALTURA + 20, width: LARGURA }}>
        {/* Linhas de referência */}
        {[0, 0.5, 1].map((pct, i) => (
          <View
            key={i}
            style={[styles.regraTracado, { position: 'absolute', top: pct * ALTURA, width: LARGURA }]}
          />
        ))}

        {/* Segmentos de linha */}
        {pontos.slice(0, -1).map((p, i) => {
          const p2 = pontos[i + 1];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const comprimento = Math.sqrt(dx * dx + dy * dy);
          const angulo = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: comprimento,
                height: 2,
                backgroundColor: AZUL,
                borderRadius: 1,
                transform: [{ rotate: `${angulo}deg` }],
                transformOrigin: '0 50%',
              }}
            />
          );
        })}

        {/* Pontos */}
        {pontos.map((p, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: p.x - 5,
              top: p.y - 5,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: AZUL,
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />
        ))}

        {/* Labels eixo X */}
        {pontos.map((p, i) => (
          <Text
            key={i}
            style={[styles.barraLabel, {
              position: 'absolute',
              top: ALTURA + 4,
              left: p.x - 12,
              width: 24,
              textAlign: 'center',
            }]}
          >
            {i + 1}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ─── Gráfico de pizza (rosca) customizado ─────────────────────────────────────

function GraficoRosca({ total }: { total: number }) {
  // Rosca simplificada com segmentos de View empilhados
  return (
    <View style={styles.roscaContainer}>
      {CATEGORIAS.map((cat, i) => (
        <View
          key={i}
          style={[
            styles.roscaSegmento,
            {
              backgroundColor: cat.color,
              flex: cat.pct,
              borderTopLeftRadius: i === 0 ? 8 : 0,
              borderBottomLeftRadius: i === 0 ? 8 : 0,
              borderTopRightRadius: i === CATEGORIAS.length - 1 ? 8 : 0,
              borderBottomRightRadius: i === CATEGORIAS.length - 1 ? 8 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function CardResumo({
  label, valor, delta, cor, wide,
}: {
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

function LinhaCategoria({ cat }: { cat: typeof CATEGORIAS[0] }) {
  return (
    <View style={styles.linhaCategoria}>
      <View style={[styles.catPonto, { backgroundColor: cat.color }]} />
      <Text style={styles.catNome}>{cat.name}</Text>
      <View style={styles.catBarraFundo}>
        <View style={[styles.catBarraFill, { width: `${cat.pct}%`, backgroundColor: cat.color }]} />
      </View>
      <Text style={styles.catValor}>{fmt(cat.valor)}</Text>
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
  const [periodo, setPeriodo] = useState<Periodo>('Mês');
  const dados = DADOS[periodo];
  const economiaPct = Math.round((dados.saldo / dados.receitas) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={estilosGlobais.tituloPrincipal}>Relatórios</Text>

        {/* Abas de período */}
        <View style={styles.tabBar}>
          {(['7D', 'Mês', '3M', 'Ano'] as Periodo[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.tab, periodo === p && styles.tabAtiva]}
              onPress={() => setPeriodo(p)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabTexto, periodo === p && styles.tabTextoAtivo]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cards resumo */}
        <View style={styles.resumoGrid}>
          <CardResumo label="Receitas" valor={fmt(dados.receitas)} delta={`↑ ${dados.deltaPct}% vs anterior`} cor={VERDE} />
          <CardResumo label="Despesas" valor={fmt(dados.despesas)} cor={VERMELHO} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <CardResumo
            label="Saldo do período"
            valor={`+ ${fmt(dados.saldo)}`}
            delta={`Economia de ${economiaPct}% da renda`}
            cor={VERDE}
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
          <GraficoBarras barras={dados.barras} />
        </View>

        {/* Saldo ao longo do tempo */}
        <Text style={styles.secaoLabel}>Saldo ao longo do tempo</Text>
        <View style={styles.card}>
          <GraficoLinha valores={dados.linha} />
        </View>

        {/* Gastos por categoria */}
        <Text style={styles.secaoLabel}>Gastos por categoria</Text>
        <View style={styles.card}>
          <View style={styles.pieResumo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardResumoLabel}>Total gasto</Text>
              <Text style={[styles.cardResumoValor, { fontSize: 22 }]}>{fmt(5218)}</Text>
              <Text style={[styles.cardResumoDelta, { color: CINZA }]}>Abril 2026</Text>
            </View>
          </View>
          <GraficoRosca total={5218} />
          <View style={{ marginTop: 16 }}>
            {CATEGORIAS.map(cat => <LinhaCategoria key={cat.name} cat={cat} />)}
          </View>
        </View>

        {/* Metas */}
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

  tabBar: {
    flexDirection: 'row', backgroundColor: '#f3f4f6',
    borderRadius: 10, padding: 3, marginBottom: 16,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 8 },
  tabAtiva: { backgroundColor: '#ffffff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 },
  tabTexto: { fontSize: 13, color: '#9ca3af' },
  tabTextoAtivo: { color: '#1f2937', fontWeight: '600' },

  resumoGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  cardResumo: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: '#e5e7eb',
  },
  cardResumoLabel: { fontSize: 11, color: '#9ca3af', marginBottom: 6 },
  cardResumoValor: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  cardResumoDelta: { fontSize: 11, marginTop: 4 },

  secaoLabel: {
    fontSize: 11, fontWeight: '600', color: '#9ca3af',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff', borderRadius: 14,
    borderWidth: 1, borderColor: '#e5e7eb', padding: 16, marginBottom: 20,
  },

  legenda: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendaQuadrado: { width: 10, height: 10, borderRadius: 2 },
  legendaTexto: { fontSize: 12, color: '#6b7280' },

  // Gráfico barras
  regraLinha: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  regraTexto: { fontSize: 9, color: '#9ca3af', width: 32 },
  regraTracado: { flex: 1, height: 0.5, backgroundColor: '#e5e7eb' },
  barrasContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 36 },
  barraGrupo: { flex: 1, alignItems: 'center' },
  barrasPar: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  barra: { borderRadius: 3 },
  barraLabel: { fontSize: 9, color: '#9ca3af', marginTop: 4, textAlign: 'center' },

  // Categoria
  linhaCategoria: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 9, borderTopWidth: 0.5, borderTopColor: '#f3f4f6',
  },
  catPonto: { width: 10, height: 10, borderRadius: 5 },
  catNome: { flex: 1, fontSize: 13, color: '#374151' },
  catBarraFundo: { width: 60, height: 5, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  catBarraFill: { height: '100%', borderRadius: 3 },
  catValor: { fontSize: 12, fontWeight: '600', color: '#1f2937', minWidth: 80, textAlign: 'right' },

  // Rosca simplificada
  roscaContainer: { flexDirection: 'row', height: 16, borderRadius: 8, overflow: 'hidden', marginBottom: 4 },
  roscaSegmento: { height: '100%' },

  pieResumo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },

  // Metas
  linhaMeta: { paddingVertical: 12, borderTopWidth: 0.5, borderTopColor: '#f3f4f6' },
  metaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metaNome: { fontSize: 14, color: '#1f2937' },
  metaPct: { fontSize: 13, fontWeight: '600' },
  metaBarraFundo: { height: 6, backgroundColor: '#f3f4f6', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  metaBarraFill: { height: '100%', borderRadius: 4 },
  metaRodape: { flexDirection: 'row', justifyContent: 'space-between' },
  metaAmt: { fontSize: 11, color: '#9ca3af' },
});