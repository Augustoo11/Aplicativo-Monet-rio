// app/(tabs)/add.tsx
// Tela de adicionar transação — conectada ao banco de dados via API

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ImageBackground,
  StatusBar, Image, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { estilosLogin } from '../../src/styles/_estilosLogin';

// ─── URL do backend ────────────────────────────────────────────────────────────
// ⚠️ Troque pela URL do seu Codespace (porta 8080) sem barra no final!
const API_URL = 'https://reimagined-enigma-wvrrx4xrq599cgjx6-8080.app.github.dev';

// ─── Mapeamento de emojis por nome de categoria ────────────────────────────────
// Como a API não tem emojis, mapeamos aqui pelo nome da categoria
const EMOJIS: Record<string, string> = {
  'Alimentação':     '🍔',
  'Transporte':      '🚗',
  'Moradia':         '🏠',
  'Saúde':           '💊',
  'Educação':        '📚',
  'Lazer':           '🌴',
  'Outros gastos':   '📦',
  'Salário':         '💼',
  'Freelance':       '💻',
  'Outras receitas': '📦',
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

// Como o banco retorna uma categoria
type CategoriaAPI = {
  id: number;
  nome: string;
  tipo: string;
  cor: string;
  padrao: boolean;
};

// Como o banco retorna uma transação
type TransacaoAPI = {
  id: number;
  tipo: string;
  valor: number;
  descricao: string;
  data: string;
  categoria: CategoriaAPI;
};

export default function Add() {
  // ─── Estados da tela ────────────────────────────────────────────────────────
  const [valor, setValor]               = useState('');
  const [tipo, setTipo]                 = useState<'despesa' | 'receita'>('despesa');
  const [categoriaSelecionada, setCat]  = useState<CategoriaAPI | null>(null);
  const [abrirCat, setAbrirCat]         = useState(false);

  // Dados vindos da API
  const [categorias, setCategorias]     = useState<CategoriaAPI[]>([]);
  const [transacoes, setTransacoes]     = useState<TransacaoAPI[]>([]);
  const [usuarioId, setUsuarioId]       = useState<string | null>(null);

  // Controle de carregamento
  const [carregandoCat, setCarregandoCat]       = useState(true);
  const [salvando, setSalvando]                 = useState(false);
  const [carregandoLista, setCarregandoLista]   = useState(false);

  // ─── Ao abrir a tela: busca usuário, categorias e transações ────────────────
  useEffect(() => {
    carregarDados();
  }, []);

  // Quando o tipo muda (receita/despesa), limpa a categoria selecionada
  useEffect(() => {
    setCat(null);
  }, [tipo]);

  async function carregarDados() {
    // 1. Pega o ID do usuário salvo no login
    const id = await AsyncStorage.getItem('@usuario_id');
    setUsuarioId(id);

    // 2. Busca as categorias do banco
    await buscarCategorias();

    // 3. Busca as transações do usuário
    if (id) await buscarTransacoes(id);
  }

  // ─── Busca categorias do banco ───────────────────────────────────────────────
  async function buscarCategorias() {
    try {
      setCarregandoCat(true);
      const resposta = await fetch(`${API_URL}/categorias`);
      const dados: CategoriaAPI[] = await resposta.json();
      setCategorias(dados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    } finally {
      setCarregandoCat(false);
    }
  }

  // ─── Busca transações do usuário ─────────────────────────────────────────────
  async function buscarTransacoes(id: string) {
    try {
      setCarregandoLista(true);
      const resposta = await fetch(`${API_URL}/transacoes/usuario/${id}`);
      const dados: TransacaoAPI[] = await resposta.json();

      // Ordena da mais recente para a mais antiga
      const ordenadas = dados.sort((a, b) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      setTransacoes(ordenadas);
    } catch (erro) {
      console.log('Erro ao buscar transações:', erro);
    } finally {
      setCarregandoLista(false);
    }
  }

  // ─── Filtra categorias pelo tipo selecionado (receita ou despesa) ────────────
  const categoriasFiltradas = categorias.filter(c => c.tipo === tipo);

  // ─── Formata o valor enquanto digita ─────────────────────────────────────────
  function formatarValor(texto: string) {
    const n = texto.replace(/\D/g, '');
    if (!n) return '';
    return `R$ ${(parseInt(n) / 100).toFixed(2).replace('.', ',')}`;
  }

  // ─── Converte "R$ 50,00" para 50.00 ──────────────────────────────────────────
  function textoParaNumero(v: string): number {
    return parseFloat(v.replace('R$ ', '').replace(',', '.') || '0');
  }

  // ─── Salva a transação no banco ───────────────────────────────────────────────
  async function salvar() {
    // Validações básicas
    if (!valor)               return Alert.alert('Erro', 'Informe o valor!');
    if (!categoriaSelecionada) return Alert.alert('Erro', 'Selecione uma categoria!');
    if (!usuarioId)           return Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');

    setSalvando(true);

    try {
      // Data de hoje no formato que o backend espera: "2026-05-31"
      const hoje = new Date().toISOString().split('T')[0];

      // Monta o JSON da transação — igual ao que você testou no Postman!
      const transacao = {
        usuario:   { id: usuarioId },
        categoria: { id: categoriaSelecionada.id },
        tipo:      tipo,
        valor:     textoParaNumero(valor),
        descricao: categoriaSelecionada.nome,
        data:      hoje,
      };

      // Envia para o backend
      const resposta = await fetch(`${API_URL}/transacoes`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(transacao),
      });

      const mensagem = await resposta.text();

      if (resposta.ok || resposta.status === 201) {
        // Sucesso! Limpa os campos e atualiza a lista
        setValor('');
        setCat(null);
        setAbrirCat(false);

        Alert.alert(
          '✅ Salvo!',
          `${EMOJIS[categoriaSelecionada.nome] || '📦'} ${categoriaSelecionada.nome} — ${valor} registrado no banco!`
        );

        // Atualiza a lista de transações
        await buscarTransacoes(usuarioId);
      } else {
        Alert.alert('Erro', mensagem || 'Não foi possível salvar a transação.');
      }

    } catch (erro) {
      Alert.alert(
        'Erro de conexão',
        'Não foi possível conectar ao servidor.\nVerifique se o backend está rodando.'
      );
    } finally {
      setSalvando(false);
    }
  }

  // ─── Calcula totais para o resumo ─────────────────────────────────────────────
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  // ─── Formata valor numérico para exibição ─────────────────────────────────────
  function formatarExibicao(v: number) {
    return v.toFixed(2).replace('.', ',');
  }

  // ─── Renderização ─────────────────────────────────────────────────────────────
  return (
    <ImageBackground source={require('../../assets/Fundo.png')} style={estilosLogin.imagemFundo}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.container}>

          {/* ── Logo + Título ── */}
          <View style={s.topo}>
            <Image source={require('../assets/logo.png')} style={s.logo} resizeMode="contain" />
            <Text style={s.titulo}>Nova Transação</Text>
          </View>

          {/* ── Toggle Receita / Despesa ── */}
          <View style={s.tipoContainer}>
            <TouchableOpacity
              style={[s.tipoBotao, tipo === 'receita' && s.receita]}
              onPress={() => setTipo('receita')}
            >
              <Text style={s.tipoTexto}>💰 Receita</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.tipoBotao, tipo === 'despesa' && s.despesa]}
              onPress={() => setTipo('despesa')}
            >
              <Text style={s.tipoTexto}>💸 Despesa</Text>
            </TouchableOpacity>
          </View>

          {/* ── Seletor de categoria ── */}
          <TouchableOpacity
            style={s.catBotao}
            onPress={() => setAbrirCat(!abrirCat)}
            disabled={carregandoCat}
          >
            <Text style={[s.catBotaoTexto, categoriaSelecionada && s.catBotaoTextoAtivo]}>
              {carregandoCat
                ? 'Carregando categorias...'
                : categoriaSelecionada
                  ? `${EMOJIS[categoriaSelecionada.nome] || '📦'}  ${categoriaSelecionada.nome}`
                  : 'Selecionar categoria'
              }
            </Text>
            <Text style={s.seta}>{abrirCat ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {/* ── Grid de categorias vindas do banco ── */}
          {abrirCat && (
            <View style={s.grid}>
              {categoriasFiltradas.length === 0 ? (
                <Text style={{ color: 'rgba(255,255,255,0.4)', padding: 10 }}>
                  Nenhuma categoria encontrada
                </Text>
              ) : (
                categoriasFiltradas.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[s.catItem, categoriaSelecionada?.id === cat.id && s.catItemAtivo]}
                    onPress={() => { setCat(cat); setAbrirCat(false); }}
                  >
                    <Text style={s.catEmoji}>{EMOJIS[cat.nome] || '📦'}</Text>
                    <Text style={[s.catLabel, categoriaSelecionada?.id === cat.id && s.catLabelAtivo]}>
                      {cat.nome}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* ── Campo de valor ── */}
          <TextInput
            style={s.input}
            placeholder="Valor (R$)"
            placeholderTextColor="#667"
            keyboardType="numeric"
            value={valor}
            onChangeText={t => setValor(formatarValor(t))}
          />

          {/* ── Botão Salvar ── */}
          <TouchableOpacity
            style={[s.botao, salvando && { opacity: 0.7 }]}
            onPress={salvar}
            disabled={salvando}
          >
            {salvando
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.botaoTexto}>Salvar no Banco 💾</Text>
            }
          </TouchableOpacity>

          {/* ── Resumo e lista de transações ── */}
          {transacoes.length > 0 && (
            <View style={{ marginTop: 30 }}>

              {/* Resumo financeiro */}
              <View style={s.resumo}>
                <View style={s.resumoItem}>
                  <Text style={s.resumoLabel}>Receitas</Text>
                  <Text style={[s.resumoValor, { color: '#4CAF50' }]}>
                    + R$ {formatarExibicao(totalReceitas)}
                  </Text>
                </View>
                <View style={s.divider} />
                <View style={s.resumoItem}>
                  <Text style={s.resumoLabel}>Despesas</Text>
                  <Text style={[s.resumoValor, { color: '#F44336' }]}>
                    - R$ {formatarExibicao(totalDespesas)}
                  </Text>
                </View>
                <View style={s.divider} />
                <View style={s.resumoItem}>
                  <Text style={s.resumoLabel}>Saldo</Text>
                  <Text style={[s.resumoValor, { color: saldo >= 0 ? '#4CAF50' : '#F44336' }]}>
                    R$ {formatarExibicao(saldo)}
                  </Text>
                </View>
              </View>

              <Text style={s.secaoLabel}>Lançamentos do banco</Text>

              {carregandoLista
                ? <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
                : transacoes.map(item => (
                    <View key={item.id} style={s.card}>
                      <View style={[
                        s.cardLinha,
                        { backgroundColor: item.tipo === 'receita' ? '#4CAF50' : '#F44336' }
                      ]} />
                      <Text style={s.cardEmoji}>
                        {EMOJIS[item.categoria?.nome] || '📦'}
                      </Text>
                      <View style={{ flex: 1, paddingVertical: 14 }}>
                        <Text style={s.cardLabel}>
                          {item.categoria?.nome || item.descricao}
                        </Text>
                        <Text style={s.cardTipo}>
                          {item.tipo === 'receita' ? '💰 Receita' : '💸 Despesa'} • {item.data}
                        </Text>
                      </View>
                      <Text style={[
                        s.cardValor,
                        { color: item.tipo === 'receita' ? '#4CAF50' : '#F44336' }
                      ]}>
                        {item.tipo === 'receita' ? '+' : '-'} R$ {formatarExibicao(item.valor)}
                      </Text>
                    </View>
                  ))
              }
            </View>
          )}

          {/* Mensagem quando não tem transações */}
          {transacoes.length === 0 && !carregandoLista && (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
                Nenhuma transação registrada ainda
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 4 }}>
                Adicione sua primeira receita ou despesa!
              </Text>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// ─── Estilos ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container:          { flexGrow: 1, padding: 20, justifyContent: 'center', paddingTop: 50 },
  topo:               { alignItems: 'center', marginBottom: 20 },
  logo:               { width: 120, height: 120, marginTop: -240 },
  titulo:             { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#fff' },
  tipoContainer:      { flexDirection: 'row', marginBottom: 14, gap: 10 },
  tipoBotao:          { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  receita:            { backgroundColor: '#4CAF50' },
  despesa:            { backgroundColor: '#F44336' },
  tipoTexto:          { color: '#fff', fontWeight: 'bold' },
  catBotao:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', padding: 15, borderRadius: 10, marginBottom: 10 },
  catBotaoTexto:      { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
  catBotaoTextoAtivo: { color: '#7ab0ff' },
  seta:               { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  grid:               { flexDirection: 'row', flexWrap: 'wrap', gap: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, marginBottom: 10 },
  catItem:            { width: '22%', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 4, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  catItemAtivo:       { backgroundColor: 'rgba(100,160,255,0.18)', borderColor: '#4e82f7' },
  catEmoji:           { fontSize: 22 },
  catLabel:           { fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 4, textAlign: 'center' },
  catLabelAtivo:      { color: '#7ab0ff', fontWeight: '600' },
  input:              { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', padding: 15, borderRadius: 10, marginBottom: 15, color: '#fff', fontSize: 18 },
  botao:              { backgroundColor: '#2176ff', padding: 16, borderRadius: 10, alignItems: 'center' },
  botaoTexto:         { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resumo:             { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 20, justifyContent: 'space-between', alignItems: 'center' },
  resumoItem:         { flex: 1, alignItems: 'center' },
  resumoLabel:        { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 },
  resumoValor:        { fontSize: 13, fontWeight: 'bold' },
  divider:            { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' },
  secaoLabel:         { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  card:               { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  cardLinha:          { width: 4, alignSelf: 'stretch' },
  cardEmoji:          { fontSize: 22, paddingHorizontal: 12 },
  cardLabel:          { fontSize: 14, fontWeight: '600', color: '#fff' },
  cardTipo:           { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  cardValor:          { fontSize: 14, fontWeight: 'bold', paddingRight: 14 },
});