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

export default function Home() {
  const receitas = 8450;
  const despesas = 5218;
  const saldo = receitas - despesas;
  const economiaPercentual = Math.round((saldo / receitas) * 100);

  const principaisDespesas = [
    { nome: 'Moradia', valor: 1800, cor: '#3B82F6' },
    { nome: 'Alimentação', valor: 1040, cor: '#EF4444' },
    { nome: 'Transporte', valor: 782, cor: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo atual</Text>
          <Text style={styles.balanceValue}>
            {saldo.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
          <Text style={styles.balanceSubtext}>
            Atualizado com base nas receitas e despesas do período
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionButton, styles.incomeButton]}>
            <Text style={styles.actionText}>+ Receita</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.expenseButton]}>
            <Text style={styles.actionText}>- Despesa</Text>
          </TouchableOpacity>
        </View>

        {/* RESUMO */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.cardTitle}>Resumo do período</Text>
            <Text style={styles.monthText}>Abril</Text>
          </View>

          <View style={styles.summaryBoxes}>
            <View style={styles.smallCard}>
              <Text style={styles.smallCardLabel}>Receitas</Text>

              <Text style={styles.incomeValue}>
                {receitas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Text>

              <Text style={styles.helperIncome}>
                ↑ 12% em relação ao mês anterior
              </Text>

              <Text style={styles.incomeDescription}>
                Entrada principal proveniente de salário e extras
              </Text>
            </View>

            <View style={styles.smallCard}>
              <Text style={styles.smallCardLabel}>Despesas</Text>

              <Text style={styles.expenseValue}>
                {despesas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Text>

              <Text style={styles.helperExpense}>
                {Math.round((despesas / receitas) * 100)}% da receita total
              </Text>

              <Text style={styles.expenseDescription}>
                Principais gastos concentrados em moradia e alimentação
              </Text>
            </View>
          </View>

          <Text style={styles.economyLabel}>Saldo do período</Text>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${economiaPercentual}%` },
              ]}
            />
          </View>

          <Text style={styles.savedText}>
            +{' '}
            {saldo.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>

          <Text style={styles.economyText}>
            Economia de {economiaPercentual}% da renda
          </Text>
        </View>

        {/* DESPESAS */}
        <View style={styles.expensesCard}>
          <View style={styles.expensesHeader}>
            <Text style={styles.cardTitle}>Principais despesas</Text>
            <Text style={styles.linkText}>Mês atual</Text>
          </View>

          <Text style={styles.expensesDescription}>
            Categorias com maior impacto no total de despesas do período.
          </Text>

          {principaisDespesas.map((item, index) => {
            const percentual = (item.valor / despesas) * 100;

            return (
              <View
                key={item.nome}
                style={[
                  styles.expenseItem,
                  index === principaisDespesas.length - 1 && styles.noBorder,
                ]}
              >
                <View style={styles.expenseTopRow}>
                  <View style={styles.expenseLeft}>
                    <View
                      style={[styles.expenseDot, { backgroundColor: item.cor }]}
                    />
                    <View>
                      <Text style={styles.expenseName}>{item.nome}</Text>
                      <Text style={styles.expenseSubtext}>
                        {Math.round(percentual)}% do total de despesas
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.expenseValueText}>
                    {item.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Text>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${percentual}%`,
                          backgroundColor: item.cor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* RECADINHO FINAL */}
        <View style={styles.tipCard}>
          <Text style={styles.cardTitle}>Análise rápida</Text>
          <Text style={styles.tipText}>
            Sua maior despesa no mês foi moradia. Mesmo com os gastos do
            período, o saldo permaneceu positivo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  pageSubtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#9CA3AF',
  },

  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  logo: {
    width: 52,
    height: 52,
  },

  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    marginBottom: 22,
  },

  balanceLabel: {
    fontSize: 18,
    color: '#9CA3AF',
    marginBottom: 10,
  },

  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
  },

  balanceSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
  },

  incomeButton: {
    backgroundColor: '#22C55E',
  },

  expenseButton: {
    backgroundColor: '#EF4444',
  },

  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
  },

  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  monthText: {
    color: '#9CA3AF',
  },

  summaryBoxes: {
    flexDirection: 'row',
    gap: 10,
  },

  smallCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
  },

  smallCardLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  incomeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },

  expenseValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },

  helperIncome: {
    fontSize: 12,
    color: '#10B981',
  },

  incomeDescription: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  helperExpense: {
    fontSize: 12,
    color: '#EF4444',
  },

  expenseDescription: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  economyLabel: {
    marginTop: 14,
    color: '#6B7280',
  },

  progressBarBackground: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    marginTop: 6,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 999,
  },

  savedText: {
    marginTop: 8,
    color: '#10B981',
    fontWeight: 'bold',
  },

  economyText: {
    fontSize: 12,
    color: '#10B981',
  },

  expensesCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
  },

  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  linkText: {
    color: '#9CA3AF',
  },

  expensesDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginVertical: 10,
  },

  expenseItem: {
    marginTop: 12,
  },

  expenseName: {
    fontWeight: 'bold',
  },

  expenseSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  expenseValueText: {
    fontSize: 12,
    color: '#6B7280',
  },

  progressContainer: {
    marginTop: 6,
  },

  progressBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  tipCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
  },

  tipText: {
    color: '#6B7280',
    marginTop: 6,
  },
});