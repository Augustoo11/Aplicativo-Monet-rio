import React, { useMemo, useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';

export default function Home() {
  const {
    totalReceitas,
    totalDespesas,
    saldo,
    transacoes,
    adicionarTransacao,
  } = useTransacoesStore();

  const [abaAtiva, setAbaAtiva] = useState<'inicio' | 'historico'>('inicio');
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');

  const [tipoSelecionado, setTipoSelecionado] = useState<'receita' | 'despesa' | null>(null);
  const [nomeTransacao, setNomeTransacao] = useState('');
  const [valorTransacao, setValorTransacao] = useState('');
  const [descricaoTransacao, setDescricaoTransacao] = useState('');

  useEffect(() => {
    const carregarNome = async () => {
      const nomeSalvo = await AsyncStorage.getItem('@usuario_nome');

      if (nomeSalvo) {
        setNomeUsuario(nomeSalvo);
      }
    };

    carregarNome();
  }, []);

  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();

  const ultimasTransacoes = useMemo(() => {
    return [...transacoes].sort((a, b) => b.data.getTime() - a.data.getTime());
  }, [transacoes]);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const mesAtual = new Date().toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const mesFormatado = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);

  const iniciaisUsuario = nomeUsuario
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((nome) => nome[0].toUpperCase())
    .join('');

  const salvarTransacao = () => {
    if (!tipoSelecionado || !nomeTransacao || !valorTransacao) {
      Alert.alert('Atenção', 'Preencha o nome e o valor.');
      return;
    }

    const valorNumerico = Number(valorTransacao.replace(',', '.'));

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    adicionarTransacao({
      tipo: tipoSelecionado,
      valor: valorNumerico,
      valorFormatado: valorNumerico.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      categoriaId: nomeTransacao.toLowerCase().replace(/\s/g, '-'),
      categoriaLabel: nomeTransacao,
      emoji: tipoSelecionado === 'receita' ? '💰' : '🧾',
    });

    setNomeTransacao('');
    setValorTransacao('');
    setDescricaoTransacao('');
    setTipoSelecionado(null);
    setModalVisible(false);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setTipoSelecionado(null);
    setNomeTransacao('');
    setValorTransacao('');
    setDescricaoTransacao('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.header}>
          <View style={styles.brandArea}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../src/assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.logoText}>GestorFin</Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{iniciaisUsuario}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {abaAtiva === 'inicio' ? (
            <>
              <Text style={styles.helloText}>
                Olá, {nomeUsuario.split(' ')[0]} · {mesFormatado}
              </Text>

              <Text
                style={[
                  styles.balance,
                  { color: saldoAtual >= 0 ? '#22C55E' : '#EF4444' },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatarMoeda(saldoAtual)}
              </Text>

              <Text style={styles.balanceLabel}>valor líquido do mês</Text>

              <View style={styles.cardsRow}>
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.dotGreen} />
                    <Text style={styles.cardLabel}>Renda</Text>
                  </View>

                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.greenText}
                  >
                    {formatarMoeda(receitas)}
                  </Text>
                </View>

                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.dotRed} />
                    <Text style={styles.cardLabel}>Despesas</Text>
                  </View>

                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.redText}
                  >
                    {formatarMoeda(despesas)}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionsHeader}>
                <Text style={styles.sectionTitle}>TRANSAÇÕES</Text>

                <TouchableOpacity onPress={() => setAbaAtiva('historico')}>
                  <Text style={styles.viewAll}>Ver tudo</Text>
                </TouchableOpacity>
              </View>

              {ultimasTransacoes.length === 0 && (
                <Text style={styles.emptyText}>
                  Nenhuma transação adicionada ainda.
                </Text>
              )}

              {ultimasTransacoes.slice(0, 5).map((item) => (
                <View style={styles.transactionItem} key={item.id}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={item.tipo === 'receita' ? 'wallet-outline' : 'arrow-down-outline'}
                      size={20}
                      color={item.tipo === 'receita' ? '#22C55E' : '#EF4444'}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.transactionTitle}>
                      {item.categoriaLabel}
                    </Text>

                    <Text style={styles.transactionDate}>
                      {item.data.toLocaleDateString('pt-BR')}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.transactionValue,
                      {
                        color: item.tipo === 'receita' ? '#22C55E' : '#EF4444',
                      },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {item.tipo === 'receita' ? '+' : '-'}
                    {item.valorFormatado}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={styles.historyTitle}>Histórico completo</Text>

              {ultimasTransacoes.length === 0 && (
                <Text style={styles.emptyText}>
                  Nenhuma transação no histórico.
                </Text>
              )}

              {ultimasTransacoes.map((item) => (
                <View style={styles.transactionItem} key={item.id}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={item.tipo === 'receita' ? 'wallet-outline' : 'arrow-down-outline'}
                      size={20}
                      color={item.tipo === 'receita' ? '#22C55E' : '#EF4444'}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.transactionTitle}>
                      {item.categoriaLabel}
                    </Text>

                    <Text style={styles.transactionDate}>
                      {item.data.toLocaleDateString('pt-BR')}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.transactionValue,
                      {
                        color: item.tipo === 'receita' ? '#22C55E' : '#EF4444',
                      },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {item.tipo === 'receita' ? '+' : '-'}
                    {item.valorFormatado}
                  </Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => setAbaAtiva('inicio')}
          >
            <FontAwesome5
              name="th-large"
              size={20}
              color={abaAtiva === 'inicio' ? '#3B82F6' : '#5C6F91'}
            />

            <Text
              style={[
                styles.bottomText,
                { color: abaAtiva === 'inicio' ? '#3B82F6' : '#5C6F91' },
              ]}
            >
              Início
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome5 name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => setAbaAtiva('historico')}
          >
            <Ionicons
              name="time-outline"
              size={22}
              color={abaAtiva === 'historico' ? '#3B82F6' : '#5C6F91'}
            />

            <Text
              style={[
                styles.bottomText,
                { color: abaAtiva === 'historico' ? '#3B82F6' : '#5C6F91' },
              ]}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalLine} />

                  <Text style={styles.modalTitle}>
                    O que deseja registrar?
                  </Text>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[
                        styles.incomeModal,
                        tipoSelecionado === 'receita' && styles.incomeSelected,
                      ]}
                      onPress={() => setTipoSelecionado('receita')}
                    >
                      <FontAwesome5 name="arrow-up" size={24} color="#22C55E" />

                      <Text
                        numberOfLines={2}
                        adjustsFontSizeToFit
                        style={styles.modalButtonTitle}
                      >
                        Nova Renda
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.expenseModal,
                        tipoSelecionado === 'despesa' && styles.expenseSelected,
                      ]}
                      onPress={() => setTipoSelecionado('despesa')}
                    >
                      <FontAwesome5 name="arrow-down" size={24} color="#EF4444" />

                      <Text
                        numberOfLines={2}
                        adjustsFontSizeToFit
                        style={styles.modalButtonTitle}
                      >
                        Nova Despesa
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {tipoSelecionado && (
                    <View style={styles.formBox}>
                      <Text style={styles.formTitle}>
                        {tipoSelecionado === 'receita'
                          ? 'Adicionar nova renda'
                          : 'Adicionar nova despesa'}
                      </Text>

                      <TextInput
                        style={styles.input}
                        placeholder={
                          tipoSelecionado === 'receita'
                            ? 'Nome da renda'
                            : 'Nome da despesa'
                        }
                        placeholderTextColor="#6B85B1"
                        value={nomeTransacao}
                        onChangeText={setNomeTransacao}
                      />

                      <TextInput
                        style={styles.input}
                        placeholder="Valor"
                        placeholderTextColor="#6B85B1"
                        keyboardType="numeric"
                        value={valorTransacao}
                        onChangeText={setValorTransacao}
                      />

                      <TextInput
                        style={[styles.input, styles.inputDescricao]}
                        placeholder="Descrição"
                        placeholderTextColor="#6B85B1"
                        value={descricaoTransacao}
                        onChangeText={setDescricaoTransacao}
                      />

                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={salvarTransacao}
                      >
                        <Text style={styles.saveButtonText}>Salvar</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity onPress={fecharModal}>
                    <Text style={styles.closeText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07101F',
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    justifyContent: 'space-between',
  },

  brandArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#12326B',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  logoImage: {
    width: 38,
    height: 38,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginLeft: 14,
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: '#1D3D8F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },

  helloText: {
    color: '#6B85B1',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 14,
  },

  balance: {
    fontSize: 52,
    fontWeight: '800',
    textAlign: 'center',
  },

  balanceLabel: {
    color: '#5C6F91',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
    fontSize: 16,
  },

  cardsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 34,
  },

  card: {
    flex: 1,
    backgroundColor: '#0D1B33',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: '#22C55E',
    marginRight: 10,
  },

  dotRed: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    marginRight: 10,
  },

  cardLabel: {
    color: '#7F95BC',
    fontSize: 15,
  },

  greenText: {
    color: '#22C55E',
    fontWeight: '800',
    fontSize: 20,
  },

  redText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 20,
  },

  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  sectionTitle: {
    color: '#6B85B1',
    letterSpacing: 2,
    fontSize: 14,
  },

  viewAll: {
    color: '#3B82F6',
    fontWeight: '700',
    fontSize: 15,
  },

  emptyText: {
    color: '#6B85B1',
    textAlign: 'center',
    marginTop: 20,
  },

  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#0D1B33',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  transactionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  transactionDate: {
    color: '#61708B',
    marginTop: 4,
    fontSize: 15,
  },

  transactionValue: {
    fontSize: 19,
    fontWeight: '800',
    maxWidth: 155,
  },

  historyTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 30,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: -22,
    right: -22,
    backgroundColor: '#081221',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#0E1B32',
  },

  bottomButton: {
    alignItems: 'center',
    width: 90,
  },

  bottomText: {
    marginTop: 6,
    fontSize: 13,
  },

  addButton: {
    width: 74,
    height: 74,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  keyboardView: {
    width: '100%',
  },

  modalContent: {
    backgroundColor: '#0B1426',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },

  modalLine: {
    width: 60,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#32415E',
    alignSelf: 'center',
    marginBottom: 28,
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 28,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 14,
  },

  incomeModal: {
    flex: 1,
    backgroundColor: '#092417',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#092417',
  },

  expenseModal: {
    flex: 1,
    backgroundColor: '#2A0D12',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A0D12',
  },

  incomeSelected: {
    borderColor: '#22C55E',
  },

  expenseSelected: {
    borderColor: '#EF4444',
  },

  modalButtonTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
    width: '100%',
  },

  formBox: {
    marginTop: 24,
  },

  formTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#081221',
    borderRadius: 16,
    padding: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#13213A',
    fontSize: 16,
  },

  inputDescricao: {
    minHeight: 54,
  },

  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  closeText: {
    color: '#3B82F6',
    textAlign: 'center',
    marginTop: 26,
    fontSize: 16,
    fontWeight: '700',
  },
});