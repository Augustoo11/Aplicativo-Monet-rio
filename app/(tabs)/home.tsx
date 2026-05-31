import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal,
  TextInput, Alert, KeyboardAvoidingView, Platform, Image, ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
// ─── IMPORT CORRIGIDO ───
import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';

// ─── URL do seu Backend ────────────────────────────────────────────────────────
const API_URL = 'https://reimagined-enigma-wvrrx4xrq599cgjx6-8080.app.github.dev';

export default function Home() {
  // ─── ADICIONADO: setTransacoesDoBanco ───
  const { totalReceitas, totalDespesas, saldo, transacoes, adicionarTransacao, setTransacoesDoBanco } =
    useTransacoesStore();

  const [abaAtiva, setAbaAtiva] = useState<'inicio' | 'metas'>('inicio');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMeta, setModalMeta] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');

  // ─── Estados para o Banco de Dados ───
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [salvando, setSalvando] = useState(false);

  const [tipoSelecionado, setTipoSelecionado] = useState<'receita' | 'despesa' | null>(null);
  const [nomeTransacao, setNomeTransacao] = useState('');
  const [valorTransacao, setValorTransacao] = useState('');
  const [descricaoTransacao, setDescricaoTransacao] = useState('');

  const [metaNome, setMetaNome] = useState('');
  const [metaValor, setMetaValor] = useState('');
  const [metas, setMetas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'receita' | 'despesa'>('todos');

  const sugestoes = ['Notebook', 'Viagem', 'Curso', 'Celular', 'Reserva'];

  // ─── Efeito para carregar dados iniciais ───
  useEffect(() => {
    async function carregarDadosIniciais() {
      const nome = await AsyncStorage.getItem('@usuario_nome');
      if (nome) setNomeUsuario(nome);

      const id = await AsyncStorage.getItem('@usuario_id');
      setUsuarioId(id);

      await buscarCategorias();

      // ─── NOVO: Busca as transações exclusivas deste usuário ───
      if (id) {
        await buscarTransacoesDoUsuario(id);
      }
    }
    carregarDadosIniciais();
  }, []);

  // ─── Buscar transações do usuário específico ───
  async function buscarTransacoesDoUsuario(idDoUsuario: string) {
    try {
      const resposta = await fetch(`${API_URL}/transacoes`);
      if (resposta.ok) {
        const todasTransacoes = await resposta.json();

        // Filtra para garantir que ninguem veja o saldo dos outros
        const transacoesDoUsuario = todasTransacoes.filter(
          (t: any) => String(t.usuario.id) === String(idDoUsuario)
        );

        const transacoesFormatadas = transacoesDoUsuario.map((t: any) => ({
          id: String(t.id),
          tipo: t.tipo,
          valor: t.valor,
          valorFormatado: formatarMoeda(t.valor),
          categoriaId: String(t.categoria.id),
          categoriaLabel: t.categoria.nome,
          descricao: t.descricao,
          data: new Date(t.data + 'T00:00:00'),
          emoji: t.tipo === 'receita' ? '💰' : '💸'
        }));

        // Atualiza o Zustand com os dados vindos do banco
        if (setTransacoesDoBanco) {
          setTransacoesDoBanco(transacoesFormatadas);
        }
      }
    } catch (erro) {
      console.log('Erro ao buscar transações:', erro);
    }
  }

  // ─── Buscar categorias da API ───
  async function buscarCategorias() {
    try {
      const resposta = await fetch(`${API_URL}/categorias`);
      if (resposta.ok) {
        const dados = await resposta.json();
        setCategorias(dados);
      }
    } catch (erro) {
      console.log('Erro ao buscar categorias na Home:', erro);
    }
  }

  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();

  const lista = [...transacoes].sort((a, b) => b.data.getTime() - a.data.getTime());
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

  const mes = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function limparFormulario() {
    setNomeTransacao('');
    setValorTransacao('');
    setDescricaoTransacao('');
    setTipoSelecionado(null);
    setModalVisible(false);
  }

  // ─── Salvar Transação (Integrado ao Banco) ───
  async function salvarTransacao() {
    if (!tipoSelecionado || !nomeTransacao || !valorTransacao) {
      Alert.alert('Atenção', 'Preencha a categoria e o valor.');
      return;
    }

    const valorNumerico = Number(valorTransacao.replace(',', '.'));

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    if (!usuarioId) {
      Alert.alert('Erro', 'Usuário não identificado. Refaça o login.');
      return;
    }

    const categoriaCorrespondente = categorias.find(
      (c) => c.nome.toLowerCase() === nomeTransacao.toLowerCase() && c.tipo === tipoSelecionado
    ) || categorias.find((c) => c.tipo === tipoSelecionado);

    if (!categoriaCorrespondente) {
      Alert.alert('Erro', 'Nenhuma categoria compatível encontrada no banco. Tente novamente mais tarde.');
      return;
    }

    setSalvando(true);

    try {
      const hoje = new Date().toISOString().split('T')[0];

      const novaTransacaoAPI = {
        usuario: { id: usuarioId },
        categoria: { id: categoriaCorrespondente.id },
        tipo: tipoSelecionado,
        valor: valorNumerico,
        descricao: descricaoTransacao || categoriaCorrespondente.nome,
        data: hoje,
      };

      const resposta = await fetch(`${API_URL}/transacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTransacaoAPI),
      });

      if (resposta.ok || resposta.status === 201) {
        // Se salvar com sucesso, atualizamos as transações do banco novamente para pegar o ID real e ordenar certo
        await buscarTransacoesDoUsuario(usuarioId);

        Alert.alert('✅ Sucesso', 'Transação registrada no banco!');
        limparFormulario();
      } else {
        const mensagemErro = await resposta.text();
        Alert.alert('Erro', mensagemErro || 'Não foi possível salvar no banco.');
      }
    } catch (erro) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor backend.');
    } finally {
      setSalvando(false);
    }
  }

  // ─── Metas ───
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

    const novaMeta = { id: Date.now(), nome: metaNome, valor };
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
        style={[styles.filterButton, filtro === valor && styles.filterSelected]}
        onPress={() => setFiltro(valor)}
      >
        <Text style={[styles.filterText, filtro === valor && styles.filterTextSelected]}>{nome}</Text>
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
          <Text style={styles.transactionDate}>{item.data.toLocaleDateString('pt-BR')}</Text>
        </View>
        <Text style={[styles.transactionValue, { color: receita ? '#22C55E' : '#EF4444' }]} numberOfLines={1} adjustsFontSizeToFit>
          {receita ? '+' : '-'}{item.valorFormatado}
        </Text>
      </View>
    );
  }

  function mostrarMeta(item: any) {
    const porcentagem = saldoAtual <= 0 ? 0 : Math.min((saldoAtual / item.valor) * 100, 100);
    const falta = item.valor - saldoAtual;
    const metaFeita = porcentagem >= 100;

    return (
      <View style={styles.metaCard} key={item.id}>
        <View style={styles.metaTop}>
          <View>
            <Text style={styles.transactionTitle}>{item.nome}</Text>
            <Text style={[styles.metaStatus, { color: metaFeita ? '#22C55E' : '#FACC15' }]}>
              {metaFeita ? 'Meta alcançada' : 'Em andamento'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => excluirMeta(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.transactionDate}>Objetivo: {formatarMoeda(item.valor)}</Text>
        <Text style={styles.transactionDate}>Saldo atual: {formatarMoeda(saldoAtual)}</Text>
        {!metaFeita && <Text style={styles.transactionDate}>Falta: {formatarMoeda(falta)}</Text>}

        <View style={styles.progressBack}>
          <View style={[styles.progressFront, { width: `${porcentagem}%` }]} />
        </View>
        <Text style={[styles.transactionDate, { marginTop: 10 }]}>{porcentagem.toFixed(0)}% concluído</Text>

        {metaFeita && (
          <View style={styles.metaConcluida}>
            <Text style={styles.metaConcluidaTexto}>Meta alcançada. Você atingiu esse objetivo.</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* ─── Header ─── */}
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

        {/* ─── Listagem ─── */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          {abaAtiva === 'inicio' ? (
            <>
              <Text style={styles.helloText}>Olá, {primeiroNome} · {mesFormatado}</Text>
              <Text style={[styles.balance, { color: saldoAtual >= 0 ? '#22C55E' : '#EF4444' }]} numberOfLines={1} adjustsFontSizeToFit>
                {formatarMoeda(saldoAtual)}
              </Text>
              <Text style={styles.balanceLabel}>valor líquido do mês</Text>

              <View style={styles.cardsRow}>
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.dotGreen} />
                    <Text style={styles.cardLabel}>Renda</Text>
                  </View>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.greenText}>{formatarMoeda(receitas)}</Text>
                </View>

                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.dotRed} />
                    <Text style={styles.cardLabel}>Despesas</Text>
                  </View>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.redText}>{formatarMoeda(despesas)}</Text>
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

              {listaFiltrada.length === 0 && <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
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

              <Text style={styles.phrase}>Acompanhe suas metas usando o saldo atual do aplicativo.</Text>

              {metas.length === 0 && (
                <View style={styles.emptyMetaBox}>
                  <Text style={styles.emptyText}>Nenhuma meta criada ainda.</Text>
                  <TouchableOpacity style={styles.firstMetaButton} onPress={() => setModalMeta(true)}>
                    <Text style={styles.saveButtonText}>Criar primeira meta</Text>
                  </TouchableOpacity>
                </View>
              )}

              {metas.map(mostrarMeta)}
            </>
          )}
        </ScrollView>

        {/* ─── Bottom Navigation ─── */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomButton} onPress={() => setAbaAtiva('inicio')}>
            <FontAwesome5 name="th-large" size={20} color={abaAtiva === 'inicio' ? '#3B82F6' : '#5C6F91'} />
            <Text style={[styles.bottomText, { color: abaAtiva === 'inicio' ? '#3B82F6' : '#5C6F91' }]}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomButton} onPress={() => setAbaAtiva('metas')}>
            <Ionicons name="flag-outline" size={22} color={abaAtiva === 'metas' ? '#3B82F6' : '#5C6F91'} />
            <Text style={[styles.bottomText, { color: abaAtiva === 'metas' ? '#3B82F6' : '#5C6F91' }]}>Metas</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Modal de Metas ─── */}
        <Modal visible={modalMeta} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.modalContent}>
                  <View style={styles.modalLine} />
                  <Text style={styles.modalTitle}>Nova Meta</Text>
                  <Text style={styles.formTitle}>Sugestões</Text>

                  <View style={styles.sugestoesArea}>
                    {sugestoes.map((item) => (
                      <TouchableOpacity key={item} style={styles.sugestaoButton} onPress={() => setMetaNome(item)}>
                        <Text style={styles.sugestaoText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Nome da meta"
                    placeholderTextColor="#9ca3af"
                    value={metaNome}
                    onChangeText={setMetaNome}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Valor a atingir (R$)"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={metaValor}
                    onChangeText={setMetaValor}
                  />

                  <View style={styles.botoesModalRow}>
                    <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalMeta(false)}>
                      <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSalvar} onPress={salvarMeta}>
                      <Text style={styles.saveButtonText}>Salvar Meta</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* ─── Modal de Nova Transação ─── */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.modalContent}>
                  <View style={styles.modalLine} />
                  <Text style={styles.modalTitle}>Nova Transação</Text>

                  <View style={styles.tipoContainer}>
                    <TouchableOpacity
                      style={[styles.tipoBotao, tipoSelecionado === 'receita' && styles.receitaBg]}
                      onPress={() => setTipoSelecionado('receita')}
                    >
                      <Text style={[styles.tipoTexto, tipoSelecionado === 'receita' && { color: '#fff' }]}>💰 Receita</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tipoBotao, tipoSelecionado === 'despesa' && styles.despesaBg]}
                      onPress={() => setTipoSelecionado('despesa')}
                    >
                      <Text style={[styles.tipoTexto, tipoSelecionado === 'despesa' && { color: '#fff' }]}>💸 Despesa</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Categoria (Ex: Salário, Alimentação)"
                    placeholderTextColor="#9ca3af"
                    value={nomeTransacao}
                    onChangeText={setNomeTransacao}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Descrição opcional"
                    placeholderTextColor="#9ca3af"
                    value={descricaoTransacao}
                    onChangeText={setDescricaoTransacao}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Valor (R$)"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={valorTransacao}
                    onChangeText={setValorTransacao}
                  />

                  <View style={styles.botoesModalRow}>
                    <TouchableOpacity style={styles.btnCancelar} onPress={limparFormulario} disabled={salvando}>
                      <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnSalvar, salvando && { opacity: 0.7 }]} onPress={salvarTransacao} disabled={salvando}>
                      {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar no Banco</Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  brandArea: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { width: 35, height: 35, backgroundColor: '#3B82F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logoImage: { width: 20, height: 20, tintColor: '#fff' },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  profileCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  profileText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  helloText: { color: '#94A3B8', fontSize: 14, marginBottom: 5 },
  balance: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginBottom: 2 },
  balanceLabel: { color: '#64748B', fontSize: 12, marginBottom: 25 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  card: { flex: 1, backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginHorizontal: 5, borderWidth: 1, borderColor: '#334155' },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 8 },
  dotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 8 },
  cardLabel: { color: '#94A3B8', fontSize: 13 },
  greenText: { color: '#22C55E', fontSize: 18, fontWeight: 'bold' },
  redText: { color: '#EF4444', fontSize: 18, fontWeight: 'bold' },
  transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: '#64748B', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  historyTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  viewAll: { color: '#3B82F6', fontSize: 14, fontWeight: 'bold' },
  phrase: { color: '#94A3B8', fontSize: 13, marginBottom: 20 },
  filterArea: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  filterButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  filterSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  filterText: { color: '#94A3B8', fontSize: 13 },
  filterTextSelected: { color: '#FFF', fontWeight: 'bold' },
  emptyText: { color: '#64748B', textAlign: 'center', marginTop: 20 },
  emptyMetaBox: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155', marginTop: 20 },
  firstMetaButton: { marginTop: 15, backgroundColor: '#3B82F6', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  transactionTitle: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  transactionDate: { color: '#64748B', fontSize: 12, marginTop: 4 },
  transactionValue: { fontSize: 15, fontWeight: 'bold', maxWidth: 100 },
  metaCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  metaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  metaStatus: { fontSize: 12, marginTop: 4, fontWeight: 'bold' },
  progressBack: { height: 8, backgroundColor: '#0F172A', borderRadius: 4, marginTop: 15, overflow: 'hidden' },
  progressFront: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 4 },
  metaConcluida: { marginTop: 15, padding: 10, backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: 8, borderWidth: 1, borderColor: '#22C55E' },
  metaConcluidaTexto: { color: '#22C55E', fontSize: 12, textAlign: 'center', fontWeight: 'bold' },
  bottomBar: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#1E293B', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 15, borderRadius: 30, borderWidth: 1, borderColor: '#334155' },
  bottomButton: { alignItems: 'center', flex: 1 },
  bottomText: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  addButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', top: -20, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  keyboardView: { width: '100%' },
  modalContent: { backgroundColor: '#1E293B', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  modalLine: { width: 40, height: 4, backgroundColor: '#334155', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  formTitle: { color: '#94A3B8', fontSize: 14, marginBottom: 10 },
  sugestoesArea: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  sugestaoButton: { backgroundColor: '#0F172A', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  sugestaoText: { color: '#94A3B8', fontSize: 13 },
  input: { backgroundColor: '#0F172A', color: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#334155', fontSize: 16 },
  tipoContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tipoBotao: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155' },
  receitaBg: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
  despesaBg: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  tipoTexto: { color: '#94A3B8', fontWeight: 'bold', fontSize: 15 },
  botoesModalRow: { flexDirection: 'row', gap: 15, marginTop: 10 },
  btnCancelar: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#0F172A', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  btnCancelarTexto: { color: '#94A3B8', fontWeight: 'bold', fontSize: 16 },
  btnSalvar: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#3B82F6', alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});