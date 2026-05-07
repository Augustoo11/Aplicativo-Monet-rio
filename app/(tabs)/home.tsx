// app/(tabs)/home.tsx
// Home — lê dados reais do store global de transações

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';

const CORES_CATEGORIA: Record<string, string> = {
  moradia: '#3B82F6',
  alimentacao: '#EF4444',
  transporte: '#F59E0B',
  saude: '#10B981',
  lazer: '#A855F7',
  educacao: '#06B6D4',
  entretenimento: '#F97316',
  outros: '#9CA3AF',
};

export default function Home() {
  const router = useRouter();
  const { totalReceitas, totalDespesas, saldo, transacoes, totalPorCategoria } = useTransacoesStore();

  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();
  const economiaPct = receitas > 0 ? Math.round((saldoAtual / receitas) * 100) : 0;
  const ultimas = [...transacoes]
    .sort((a, b) => b.data.getTime() - a.data.getTime())
    .slice(0, 5);
  const categorias = totalPorCategoria().slice(0, 3);

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const temDados = ultimas.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Início</Text>
            <Text style={styles.pageSubtitle}>Visão geral das suas finanças</Text>
          </View>
          <View style={styles.logoBox}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* CARD SALDO */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo atual</Text>
          <Text style={[styles.balanceValue, { color: saldoAtual >= 0 ? '#10B981' : '#EF4444' }]}>
            {fmt(saldoAtual)}
          </Text>
          <Text style={styles.balanceSubtext}>
            {temDados
              ? 'Calculado com base nas suas transações registradas'
              : 'Nenhuma transação registrada ainda'}
          </Text>
        </View>

        {/* BOTÕES RÁPIDOS */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.incomeButton]}
            onPress={() => router.push('/(tabs)/add')}
          >
            <Text style={styles.actionText}>+ Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.expenseButton]}
            onPress={() => router.push('/(tabs)/add')}
          >
            <Text style={styles.actionText}>− Despesa</Text>
          </TouchableOpacity>
        </View>

        {/* RESUMO DO PERÍODO */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.cardTitle}>Resumo do período</Text>
            <Text style={styles.monthText}>
              {new Date().toLocaleString('pt-BR', { month: 'long' })}
            </Text>
          </View>

          <View style={styles.summaryBoxes}>
            <View style={styles.smallCard}>
              <Text style={styles.smallCardLabel}>Receitas</Text>
              <Text style={styles.incomeValue}>{fmt(receitas)}</Text>
              <Text style={styles.incomeDescription}>
                {temDados ? 'Total de entradas registradas' : 'Nenhuma receita ainda'}
              </Text>
            </View>

            <View style={styles.smallCard}>
              <Text style={styles.smallCardLabel}>Despesas</Text>
              <Text style={styles.expenseValue}>{fmt(despesas)}</Text>
              <Text style={styles.expenseDescription}>
                {temDados
                  ? `${receitas > 0 ? Math.round((despesas / receitas) * 100) : 0}% da receita total`
                  : 'Nenhuma despesa ainda'}
              </Text>
            </View>
          </View>

          {temDados && (
            <>
              <Text style={styles.economyLabel}>Saldo do período</Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(Math.max(economiaPct, 0), 100)}%`,
                      backgroundColor: saldoAtual >= 0 ? '#10B981' : '#EF4444',
                    },
                  ]}
                />
              </View>
              <Text style={[styles.savedText, { color: saldoAtual >= 0 ? '#10B981' : '#EF4444' }]}>
                {saldoAtual >= 0 ? '+' : ''} {fmt(saldoAtual)}
              </Text>
              {receitas > 0 && (
                <Text style={styles.economyText}>
                  {economiaPct >= 0
                    ? `Economia de ${economiaPct}% da renda`
                    : `Déficit de ${Math.abs(economiaPct)}% da renda`}
                </Text>
              )}
            </>
          )}

          {!temDados && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)/add')}
            >
              <Text style={styles.emptyButtonText}>+ Adicionar primeira transação</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* PRINCIPAIS DESPESAS POR CATEGORIA */}
        {categorias.length > 0 && (
          <View style={styles.expensesCard}>
            <View style={styles.expensesHeader}>
              <Text style={styles.cardTitle}>Principais despesas</Text>
            </View>
            <Text style={styles.expensesDescription}>
              Categorias com maior impacto no total de despesas.
            </Text>

            {categorias.map((cat, index) => {
              const pct = despesas > 0 ? (cat.total / despesas) * 100 : 0;
              const cor = CORES_CATEGORIA[cat.categoriaId] ?? '#9CA3AF';
              return (
                <View
                  key={cat.categoriaId}
                  style={[
                    styles.expenseItem,
                    index === categorias.length - 1 && styles.noBorder,
                  ]}
                >
                  <View style={styles.expenseTopRow}>
                    <View style={styles.expenseLeft}>
                      <View style={[styles.expenseDot, { backgroundColor: cor }]} />
                      <View>
                        <Text style={styles.expenseName}>
                          {cat.emoji} {cat.label}
                        </Text>
                        <Text style={styles.expenseSubtext}>
                          {Math.round(pct)}% do total de despesas
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.expenseValueText}>{fmt(cat.total)}</Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBg}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${pct}%`, backgroundColor: cor },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ÚLTIMAS TRANSAÇÕES */}
        {ultimas.length > 0 && (
          <View style={styles.expensesCard}>
            <Text style={styles.cardTitle}>Últimas transações</Text>
            <Text style={styles.expensesDescription}>
              Pressione e segure em Add para excluir.
            </Text>

            {ultimas.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.transacaoItem,
                  index === ultimas.length - 1 && styles.noBorder,
                ]}
              >
                <Text style={{ fontSize: 24, marginRight: 12 }}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.expenseName}>{item.categoriaLabel}</Text>
                  <Text style={styles.expenseSubtext}>
                    {item.tipo === 'receita' ? 'Receita' : 'Despesa'} ·{' '}
                    {item.data.toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.expenseValueText,
                    { color: item.tipo === 'receita' ? '#10B981' : '#EF4444', fontWeight: '700' },
                  ]}
                >
                  {item.tipo === 'receita' ? '+' : '−'} {item.valorFormatado}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* DICA FINAL */}
        {temDados && (
          <View style={styles.tipCard}>
            <Text style={styles.cardTitle}>Análise rápida</Text>
            <Text style={styles.tipText}>
              {saldoAtual >= 0
                ? `Seu saldo está positivo em ${fmt(saldoAtual)}. Continue controlando seus gastos! 🎯`
                : `Suas despesas estão ${fmt(Math.abs(saldoAtual))} acima das receitas. Revise seus gastos. ⚠️`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  pageTitle: { fontSize: 30, fontWeight: 'bold', color: '#1F2937' },
  pageSubtitle: { marginTop: 6, fontSize: 16, color: '#9CA3AF' },
  logoBox: { width: 80, height: 80, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  logo: { width: 52, height: 52 },

  balanceCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, marginBottom: 22 },
  balanceLabel: { fontSize: 18, color: '#9CA3AF', marginBottom: 10 },
  balanceValue: { fontSize: 36, fontWeight: 'bold' },
  balanceSubtext: { marginTop: 8, fontSize: 14, color: '#9CA3AF' },

  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  actionButton: { flex: 1, paddingVertical: 18, borderRadius: 18, alignItems: 'center' },
  incomeButton: { backgroundColor: '#22C55E' },
  expenseButton: { backgroundColor: '#EF4444' },
  actionText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },

  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 22 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  monthText: { color: '#9CA3AF', textTransform: 'capitalize' },
  summaryBoxes: { flexDirection: 'row', gap: 10 },
  smallCard: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 16, padding: 12 },
  smallCardLabel: { fontSize: 14, color: '#6B7280' },
  incomeValue: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
  expenseValue: { fontSize: 16, fontWeight: 'bold', color: '#EF4444' },
  incomeDescription: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  expenseDescription: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  economyLabel: { marginTop: 14, color: '#6B7280' },
  progressBarBackground: { height: 10, backgroundColor: '#E5E7EB', borderRadius: 999, marginTop: 6 },
  progressBarFill: { height: '100%', borderRadius: 999 },
  savedText: { marginTop: 8, fontWeight: 'bold' },
  economyText: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  emptyButton: { marginTop: 16, backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, alignItems: 'center' },
  emptyButtonText: { color: '#3B82F6', fontWeight: '600' },

  expensesCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, marginBottom: 20 },
  expensesHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  expensesDescription: { fontSize: 13, color: '#9CA3AF', marginVertical: 10 },

  expenseItem: { marginTop: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  noBorder: { borderBottomWidth: 0 },
  expenseTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expenseLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  expenseDot: { width: 10, height: 10, borderRadius: 5 },
  expenseName: { fontWeight: 'bold', color: '#1F2937' },
  expenseSubtext: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  expenseValueText: { fontSize: 13, color: '#6B7280' },
  progressContainer: { marginTop: 6 },
  progressBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 999 },
  progressFill: { height: '100%', borderRadius: 999 },

  transacaoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },

  tipCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, marginBottom: 8 },
  tipText: { color: '#6B7280', marginTop: 6, lineHeight: 20 },
});