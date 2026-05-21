import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal,
  TextInput, Alert, KeyboardAvoidingView, Platform, Image
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
    removerTransacao,
  } = useTransacoesStore();

  const [abaAtiva, setAbaAtiva] = useState<'inicio' | 'metas'>('inicio');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMeta, setModalMeta] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');

  const [tipoSelecionado, setTipoSelecionado] =
    useState<'receita' | 'despesa' | null>(null);

  const [nomeTransacao, setNomeTransacao] = useState('');
  const [valorTransacao, setValorTransacao] = useState('');
  const [descricaoTransacao, setDescricaoTransacao] = useState('');

  const [metaNome, setMetaNome] = useState('');
  const [metaValor, setMetaValor] = useState('');
  const [metas, setMetas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'receita' | 'despesa'>('todos');

  const sugestoes = ['Notebook', 'Viagem', 'Curso', 'Celular', 'Reserva'];

  useEffect(() => {
    async function carregarNome() {
      const nome = await AsyncStorage.getItem('@usuario_nome');
      if (nome) setNomeUsuario(nome);
    }

    carregarNome();
  }, []);

  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();

  const lista = [...transacoes].sort(
    (a, b) => b.data.getTime() - a.data.getTime()
  );

  const listaFiltrada = lista.filter((item) => {
    if (filtro === 'todos') return true;
    return item.tipo === filtro;
  });

  const primeiroNome = nomeUsuario.split(' ')[0];

  const iniciaisUsuario = nomeUsuario
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((nome) => nome[0].toUpperCase())
    .join('');

  const mes = new Date().toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function limparFormulario() {
    setNomeTransacao('');
    setValorTransacao('');
    setDescricaoTransacao('');
    setTipoSelecionado(null);
    setModalVisible(false);
  }

  function salvarTransacao() {
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
      valorFormatado: formatarMoeda(valorNumerico),
      categoriaId: nomeTransacao.toLowerCase().replace(/\s/g, '-'),
      categoriaLabel: nomeTransacao,
      emoji: tipoSelecionado,
    });

    limparFormulario();
  }

  function salvarMeta() {
    if (!metaNome || !metaValor) {
      Alert.alert('Atenção', 'Preencha o nome e o valor da meta.');
      return;
    }

    const valor = Number(metaValor.replace(',', '.'));

    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    const novaMeta = {
      id: Date.now(),
      nome: metaNome,
      valor,
    };

    setMetas([...metas, novaMeta]);
    setMetaNome('');
    setMetaValor('');
    setModalMeta(false);
  }

  function excluirMeta(id: number) {
    setMetas(metas.filter((item) => item.id !== id));
  }

  function BotaoFiltro({ nome, valor }: any) {
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          filtro === valor && styles.filterSelected,
        ]}
        onPress={() => setFiltro(valor)}
      >
        <Text
          style={[
            styles.filterText,
            filtro === valor && styles.filterTextSelected,
          ]}
        >
          {nome}
        </Text>
      </TouchableOpacity>
    );
  }

  function mostrarTransacao(item: any) {
    const receita = item.tipo === 'receita';

    return (
      <View style={styles.transactionItem} key={item.id}>
        <View style={styles.iconBox}>
          <Ionicons
            name={receita ? 'wallet-outline' : 'arrow-down-outline'}
            size={20}
            color={receita ? '#22C55E' : '#EF4444'}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.transactionTitle}>{item.categoriaLabel}</Text>
          <Text style={styles.transactionDate}>
            {item.data.toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={styles.valueArea}>
          <Text
            style={[
              styles.transactionValue,
              { color: receita ? '#22C55E' : '#EF4444' },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {receita ? '+' : '-'}
            {item.valorFormatado}
          </Text>

          <TouchableOpacity onPress={() => removerTransacao(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function mostrarMeta(item: any) {
    const porcentagem =
      saldoAtual <= 0
        ? 0
        : Math.min((saldoAtual / item.valor) * 100, 100);

    const falta = item.valor - saldoAtual;
    const metaFeita = porcentagem >= 100;

    return (
      <View style={styles.metaCard} key={item.id}>
        <View style={styles.metaTop}>
          <View>
            <Text style={styles.transactionTitle}>{item.nome}</Text>

            <Text
              style={[
                styles.metaStatus,
                { color: metaFeita ? '#22C55E' : '#FACC15' },
              ]}
            >
              {metaFeita ? 'Meta alcançada' : 'Em andamento'}
            </Text>
          </View>

          <TouchableOpacity onPress={() => excluirMeta(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.transactionDate}>
          Objetivo: {formatarMoeda(item.valor)}
        </Text>

        <Text style={styles.transactionDate}>
          Saldo atual: {formatarMoeda(saldoAtual)}
        </Text>

        {!metaFeita && (
          <Text style={styles.transactionDate}>
            Falta: {formatarMoeda(falta)}
          </Text>
        )}

        <View style={styles.progressBack}>
          <View
            style={[
              styles.progressFront,
              { width: `${porcentagem}%` },
            ]}
          />
        </View>

        <Text style={[styles.transactionDate, { marginTop: 10 }]}>
          {porcentagem.toFixed(0)}% concluído
        </Text>

        {metaFeita && (
          <View style={styles.metaConcluida}>
            <Text style={styles.metaConcluidaTexto}>
              Meta alcançada. Você atingiu esse objetivo.
            </Text>
          </View>
        )}
      </View>
    );
  }

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
                Olá, {primeiroNome} · {mesFormatado}
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

                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.greenText}>
                    {formatarMoeda(receitas)}
                  </Text>
                </View>

                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.dotRed} />
                    <Text style={styles.cardLabel}>Despesas</Text>
                  </View>

                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.redText}>
                    {formatarMoeda(despesas)}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionsHeader}>
                <Text style={styles.sectionTitle}>TRANSAÇÕES</Text>
              </View>

              <View style={styles.filterArea}>
                <BotaoFiltro nome="Todos" valor="todos" />
                <BotaoFiltro nome="Receitas" valor="receita" />
                <BotaoFiltro nome="Despesas" valor="despesa" />
              </View>

              {listaFiltrada.length === 0 && (
                <Text style={styles.emptyText}>
                  Nenhuma transação encontrada.
                </Text>
              )}

              {listaFiltrada.slice(0, 5).map(mostrarTransacao)}
            </>
          ) : (
            <>
              <View style={styles.transactionsHeader}>
                <Text style={styles.historyTitle}>Metas</Text>

                <TouchableOpacity onPress={() => setModalMeta(true)}>
                  <Text style={styles.viewAll}>Nova meta</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.phrase}>
                Acompanhe suas metas usando o saldo atual do aplicativo.
              </Text>

              {metas.length === 0 && (
                <View style={styles.emptyMetaBox}>
                  <Text style={styles.emptyText}>
                    Nenhuma meta criada ainda.
                  </Text>

                  <TouchableOpacity
                    style={styles.firstMetaButton}
                    onPress={() => setModalMeta(true)}
                  >
                    <Text style={styles.saveButtonText}>Criar primeira meta</Text>
                  </TouchableOpacity>
                </View>
              )}

              {metas.map(mostrarMeta)}
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
            onPress={() => setAbaAtiva('metas')}
          >
            <Ionicons
              name="flag-outline"
              size={22}
              color={abaAtiva === 'metas' ? '#3B82F6' : '#5C6F91'}
            />

            <Text
              style={[
                styles.bottomText,
                { color: abaAtiva === 'metas' ? '#3B82F6' : '#5C6F91' },
              ]}
            >
              Metas
            </Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalMeta} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.modalContent}>
                  <View style={styles.modalLine} />

                  <Text style={styles.modalTitle}>Nova Meta</Text>

                  <Text style={styles.formTitle}>Sugestões</Text>

                  <View style={styles.sugestoesArea}>
                    {sugestoes.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={styles.sugestaoButton}
                        onPress={() => setMetaNome(item)}
                      >
                        <Text style={styles.sugestaoText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Nome da meta"
                    placeholderTextColor="#6B85B1"
                    value={metaNome}
                    onChangeText={setMetaNome}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Valor da meta"
                    placeholderTextColor="#6B85B1"
                    keyboardType="numeric"
                    value={metaValor}
                    onChangeText={setMetaValor}
                  />

                  <TouchableOpacity style={styles.saveButton} onPress={salvarMeta}>
                    <Text style={styles.saveButtonText}>Salvar Meta</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setModalMeta(false)}>
                    <Text style={styles.closeText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.modalContent}>
                  <View style={styles.modalLine} />

                  <Text style={styles.modalTitle}>O que deseja registrar?</Text>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[
                        styles.incomeModal,
                        tipoSelecionado === 'receita' && styles.incomeSelected,
                      ]}
                      onPress={() => setTipoSelecionado('receita')}
                    >
                      <FontAwesome5 name="arrow-up" size={24} color="#22C55E" />
                      <Text style={styles.modalButtonTitle}>Nova Renda</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.expenseModal,
                        tipoSelecionado === 'despesa' && styles.expenseSelected,
                      ]}
                      onPress={() => setTipoSelecionado('despesa')}
                    >
                      <FontAwesome5 name="arrow-down" size={24} color="#EF4444" />
                      <Text style={styles.modalButtonTitle}>Nova Despesa</Text>
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

                      <TouchableOpacity style={styles.saveButton} onPress={salvarTransacao}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity onPress={limparFormulario}>
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
  container: { flex: 1, backgroundColor: '#07101F' },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 10 },

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

  logoImage: { width: 38, height: 38 },

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

  cardLabel: { color: '#7F95BC', fontSize: 15 },
  greenText: { color: '#22C55E', fontWeight: '800', fontSize: 20 },
  redText: { color: '#EF4444', fontWeight: '800', fontSize: 20 },

  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  sectionTitle: { color: '#6B85B1', letterSpacing: 2, fontSize: 14 },
  viewAll: { color: '#3B82F6', fontWeight: '700', fontSize: 15 },
  emptyText: { color: '#6B85B1', textAlign: 'center', marginTop: 20 },

  filterArea: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  filterButton: {
    backgroundColor: '#0D1B33',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  filterSelected: {
    backgroundColor: '#2563EB',
  },

  filterText: {
    color: '#6B85B1',
    fontWeight: '700',
  },

  filterTextSelected: {
    color: '#FFFFFF',
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

  transactionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  transactionDate: { color: '#61708B', marginTop: 4, fontSize: 15 },

  valueArea: {
    alignItems: 'flex-end',
    gap: 8,
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
  },

  phrase: {
    color: '#7F95BC',
    fontSize: 15,
    marginBottom: 20,
  },

  emptyMetaBox: {
    alignItems: 'center',
    marginTop: 20,
  },

  firstMetaButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 18,
  },

  metaCard: {
    backgroundColor: '#0D1B33',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },

  metaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  metaStatus: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '800',
  },

  progressBack: {
    height: 12,
    backgroundColor: '#13213A',
    borderRadius: 10,
    marginTop: 15,
    overflow: 'hidden',
  },

  progressFront: {
    height: 12,
    backgroundColor: '#2563EB',
  },

  metaConcluida: {
    backgroundColor: '#092417',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },

  metaConcluidaTexto: {
    color: '#22C55E',
    fontWeight: '800',
    textAlign: 'center',
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

  bottomButton: { alignItems: 'center', width: 90 },
  bottomText: { marginTop: 6, fontSize: 13 },

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

  keyboardView: { width: '100%' },

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

  incomeSelected: { borderColor: '#22C55E' },
  expenseSelected: { borderColor: '#EF4444' },

  modalButtonTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
    width: '100%',
  },

  formBox: { marginTop: 24 },

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

  inputDescricao: { minHeight: 54 },

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

  sugestoesArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },

  sugestaoButton: {
    backgroundColor: '#081221',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#13213A',
  },

  sugestaoText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});