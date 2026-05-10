// app/(tabs)/Menu.tsx
// Relatórios — lê dados reais do store global

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';

const AZUL = '#3b82f6';
const VERDE = '#10b981';
const VERMELHO = '#ef4444';
const AMARELO = '#f59e0b';
const ROXO = '#a855f7';
const CINZA = '#9ca3af';

const CORES_METAS = [VERDE, AZUL, AMARELO, ROXO, VERMELHO];

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

type Meta = {
  id: string;
  name: string;
  target: number;
  color: string;
};

const fmt = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtK = (v: number) =>
  v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`;

function GraficoBarras({ barras }: { barras: { label: string; receita: number; despesa: number }[] }) {
  const ALTURA = 180;
  const maiorValor = Math.max(...barras.map(b => Math.max(b.receita, b.despesa)), 1);
  const barWidth = 26;

  return (
    <View>
      <View style={{ height: ALTURA, justifyContent: 'space-between', marginBottom: 8 }}>
        {[100, 75, 50, 25, 0].map((pct) => (
          <View key={pct} style={styles.regraLinha}>
            <Text style={styles.regraTexto}>{fmtK(Math.round((maiorValor * pct) / 100))}</Text>
            <View style={styles.regraTracado} />
          </View>
        ))}
      </View>

      <View
        style={{
          height: ALTURA,
          marginTop: -ALTURA - 8,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          paddingLeft: 30,
          overflow: 'hidden',
        }}
      >
        {barras.map((b, i) => {
          const alturaReceita = Math.max((b.receita / maiorValor) * ALTURA, 6);
          const alturaDespesa = Math.max((b.despesa / maiorValor) * ALTURA, 6);

          return (
            <View key={i} style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                <View style={{ width: barWidth, height: alturaReceita, backgroundColor: VERDE, borderRadius: 6 }} />
                <View style={{ width: barWidth, height: alturaDespesa, backgroundColor: VERMELHO, borderRadius: 6 }} />
              </View>
              <Text style={styles.barraLabel}>{b.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function GraficoLinha({ valores }: { valores: number[] }) {
  const ALTURA = 150;
  const LARGURA = CHART_WIDTH - 110;
  const PADDING = 12;

  const maxVal = Math.max(...valores, 1);
  const minVal = Math.min(...valores);
  const range = maxVal - minVal || 1;

  const pontos = valores.map((v, i) => ({
    x: valores.length > 1 ? (i / (valores.length - 1)) * LARGURA : LARGURA / 2,
    y: PADDING + (ALTURA - PADDING * 2) - ((v - minVal) / range) * (ALTURA - PADDING * 2),
  }));

  return (
    <View style={{ flexDirection: 'row', height: ALTURA + 20 }}>
      <View style={{ width: 42, justifyContent: 'space-between' }}>
        {[maxVal, Math.round((maxVal + minVal) / 2), minVal].map((v, i) => (
          <Text key={i} style={styles.regraTexto}>{fmtK(v)}</Text>
        ))}
      </View>

      <View style={{ height: ALTURA, width: LARGURA, overflow: 'hidden', position: 'relative' }}>
        {[0, 0.5, 1].map((pct, i) => (
          <View
            key={i}
            style={[
              styles.regraTracado,
              { position: 'absolute', top: pct * ALTURA, width: LARGURA },
            ]}
          />
        ))}

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
                left: p.x + dx / 2 - comprimento / 2,
                top: p.y + dy / 2,
                width: comprimento,
                height: 3,
                backgroundColor: AZUL,
                borderRadius: 2,
                transform: [{ rotate: `${angulo}deg` }],
              }}
            />
          );
        })}

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
      </View>
    </View>
  );
}

function GraficoRosca({ segmentos }: { segmentos: { pct: number; color: string }[] }) {
  return (
    <View style={styles.roscaContainer}>
      {segmentos.map((s, i) => (
        <View key={i} style={[styles.roscaSegmento, { flex: s.pct, backgroundColor: s.color }]} />
      ))}
    </View>
  );
}

function CardResumo({ label, valor, delta, cor, wide }: {
  label: string;
  valor: string;
  delta?: string;
  cor?: string;
  wide?: boolean;
}) {
  return (
    <View style={[styles.cardResumo, wide && { flex: undefined, width: '100%' }]}>
      <Text style={styles.cardResumoLabel}>{label}</Text>
      <Text style={[styles.cardResumoValor, cor ? { color: cor } : {}]}>{valor}</Text>
      {delta ? <Text style={[styles.cardResumoDelta, { color: cor }]}>{delta}</Text> : null}
    </View>
  );
}

function LinhaMeta({
  meta,
  valorGuardado,
  onEditar,
  onExcluir,
}: {
  meta: Meta;
  valorGuardado: number;
  onEditar: () => void;
  onExcluir: () => void;
}) {
  const pct = meta.target > 0 ? Math.min(Math.round((valorGuardado / meta.target) * 100), 100) : 0;

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
        <Text style={styles.metaAmt}>{fmt(valorGuardado)} guardados</Text>
        <Text style={styles.metaAmt}>Meta: {fmt(meta.target)}</Text>
      </View>

      <View style={styles.metaAcoes}>
        <TouchableOpacity onPress={onEditar} style={styles.botaoEditar}>
          <Text style={styles.botaoEditarTexto}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onExcluir} style={styles.botaoExcluir}>
          <Text style={styles.botaoExcluirTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MenuScreen() {
  const { transacoes, totalReceitas, totalDespesas, saldo, totalPorCategoria } = useTransacoesStore();

  const [metas, setMetas] = useState<Meta[]>([]);
  const [nomeMeta, setNomeMeta] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();

  const valorGuardado = Math.max(saldoAtual, 0);

  const economiaPct = receitas > 0 ? Math.round((saldoAtual / receitas) * 100) : 0;
  const categorias = totalPorCategoria();
  const totalDespesasCateg = despesas || 1;
  const temDados = transacoes.length > 0;

  function converterValorMeta(texto: string) {
    const valorLimpo = texto
      .replace(/[^\d,.-]/g, '')
      .replace(',', '.');

    return Number(valorLimpo);
  }

  function limparFormularioMeta() {
    setNomeMeta('');
    setValorMeta('');
    setEditandoId(null);
  }

  function salvarMeta() {
    const nome = nomeMeta.trim();
    const objetivo = converterValorMeta(valorMeta);

    if (!nome) {
      Alert.alert('Erro', 'Informe o nome da meta.');
      return;
    }

    if (!objetivo || objetivo <= 0) {
      Alert.alert('Erro', 'Informe um valor válido para a meta.');
      return;
    }

    if (editandoId) {
      setMetas(metas.map(meta =>
        meta.id === editandoId
          ? { ...meta, name: nome, target: objetivo }
          : meta
      ));

      limparFormularioMeta();
      return;
    }

    const novaMeta: Meta = {
      id: String(Date.now()),
      name: nome,
      target: objetivo,
      color: CORES_METAS[metas.length % CORES_METAS.length],
    };

    setMetas([...metas, novaMeta]);
    limparFormularioMeta();
  }

  function editarMeta(meta: Meta) {
    setEditandoId(meta.id);
    setNomeMeta(meta.name);
    setValorMeta(String(meta.target));
  }

  function excluirMeta(id: string) {
    Alert.alert('Excluir meta', 'Tem certeza que deseja excluir esta meta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          setMetas(metas.filter(meta => meta.id !== id));
          if (editandoId === id) limparFormularioMeta();
        },
      },
    ]);
  }

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

            <Text style={styles.secaoLabel}>Receitas vs Despesas</Text>
            <View style={styles.card}>
              <View style={styles.legenda}>
                <View style={styles.legendaItem}>
                  <View style={[styles.legendaQuadrado, { backgroundColor: VERDE }]} />
                  <Text style={styles.legendaTexto}>Receitas</Text>
                </View>

                <View style={styles.legendaItem}>
                  <View style={[styles.legendaQuadrado, { backgroundColor: VERMELHO }]} />
                  <Text style={styles.legendaTexto}>Despesas</Text>
                </View>
              </View>

              <GraficoBarras barras={barrasPorMes} />
            </View>

            <Text style={styles.secaoLabel}>Saldo acumulado</Text>
            <View style={styles.card}>
              <GraficoLinha valores={linhaAcumulada} />
            </View>

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

                          <Text style={styles.catNome} numberOfLines={1}>
                            {cat.emoji} {cat.label}
                          </Text>

                          <View style={styles.catBarraFundo}>
                            <View style={[styles.catBarraFill, { width: `${pct}%`, backgroundColor: cor }]} />
                          </View>

                          <Text style={styles.catValor} numberOfLines={1}>
                            {fmt(cat.total)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </>
            )}
          </>
        )}

        <Text style={styles.secaoLabel}>Metas financeiras</Text>

        <View style={styles.card}>
          <Text style={styles.metaFormTitulo}>
            {editandoId ? 'Editar meta' : 'Adicionar nova meta'}
          </Text>

          <TextInput
            style={styles.inputMeta}
            placeholder="Nome da meta"
            placeholderTextColor="#9ca3af"
            value={nomeMeta}
            onChangeText={setNomeMeta}
          />

          <TextInput
            style={styles.inputMeta}
            placeholder="Valor objetivo"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            value={valorMeta}
            onChangeText={setValorMeta}
          />

          <View style={styles.metaFormBotoes}>
            <TouchableOpacity style={styles.botaoSalvarMeta} onPress={salvarMeta}>
              <Text style={styles.botaoSalvarMetaTexto}>
                {editandoId ? 'Salvar edição' : 'Adicionar meta'}
              </Text>
            </TouchableOpacity>

            {editandoId && (
              <TouchableOpacity style={styles.botaoCancelarMeta} onPress={limparFormularioMeta}>
                <Text style={styles.botaoCancelarMetaTexto}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={[styles.card, { marginBottom: 32 }]}>
          <View style={styles.metaSaldoBox}>
            <Text style={styles.cardResumoLabel}>Valor disponível para metas</Text>
            <Text style={[styles.cardResumoValor, { color: valorGuardado > 0 ? VERDE : CINZA }]}>
              {fmt(valorGuardado)}
            </Text>
            <Text style={styles.metaAviso}>
              Esse valor acompanha o saldo atual da Home.
            </Text>
          </View>

          {metas.length === 0 ? (
            <View style={styles.emptyMetas}>
              <Text style={styles.emptyMetasTexto}>Nenhuma meta criada ainda.</Text>
              <Text style={styles.emptyMetasSubtexto}>
                Adicione uma meta acima para acompanhar seu progresso.
              </Text>
            </View>
          ) : (
            metas.map(meta => (
              <LinhaMeta
                key={meta.id}
                meta={meta}
                valorGuardado={valorGuardado}
                onEditar={() => editarMeta(meta)}
                onExcluir={() => excluirMeta(meta.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },

  scroll: {
    padding: 20,
    paddingTop: 45,
  },

  tituloPagina: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
  },

  emptyEmoji: { fontSize: 48, marginBottom: 12 },

  emptyTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },

  emptySubtitulo: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  resumoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },

  cardResumo: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  cardResumoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 6,
  },

  cardResumoValor: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },

  cardResumoDelta: {
    fontSize: 11,
    marginTop: 4,
  },

  secaoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },

  legenda: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },

  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  legendaQuadrado: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },

  legendaTexto: {
    fontSize: 12,
    color: '#6b7280',
  },

  regraLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  regraTexto: {
    fontSize: 9,
    color: '#9ca3af',
    width: 32,
  },

  regraTracado: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#e5e7eb',
  },

  barraLabel: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },

  roscaContainer: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },

  roscaSegmento: {
    height: '100%',
  },

  pieResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  linhaCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    borderTopWidth: 0.5,
    borderTopColor: '#f3f4f6',
  },

  catPonto: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  catNome: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
  },

  catBarraFundo: {
    width: 45,
    height: 5,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },

  catBarraFill: {
    height: '100%',
    borderRadius: 3,
  },

  catValor: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1f2937',
    width: 70,
    textAlign: 'right',
  },

  metaFormTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },

  inputMeta: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 10,
  },

  metaFormBotoes: {
    flexDirection: 'row',
    gap: 10,
  },

  botaoSalvarMeta: {
    flex: 1,
    backgroundColor: AZUL,
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  botaoSalvarMetaTexto: {
    color: '#ffffff',
    fontWeight: '700',
  },

  botaoCancelarMeta: {
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },

  botaoCancelarMetaTexto: {
    color: '#6b7280',
    fontWeight: '700',
  },

  metaSaldoBox: {
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f3f4f6',
    marginBottom: 8,
  },

  metaAviso: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },

  emptyMetas: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  emptyMetasTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },

  emptyMetasSubtexto: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },

  linhaMeta: {
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#f3f4f6',
  },

  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  metaNome: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },

  metaPct: {
    fontSize: 13,
    fontWeight: '600',
  },

  metaBarraFundo: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },

  metaBarraFill: {
    height: '100%',
    borderRadius: 4,
  },

  metaRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  metaAmt: {
    fontSize: 11,
    color: '#9ca3af',
  },

  metaAcoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },

  botaoEditar: {
    backgroundColor: '#eff6ff',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  botaoEditarTexto: {
    color: AZUL,
    fontWeight: '700',
    fontSize: 12,
  },

  botaoExcluir: {
    backgroundColor: '#fef2f2',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  botaoExcluirTexto: {
    color: VERMELHO,
    fontWeight: '700',
    fontSize: 12,
  },
});