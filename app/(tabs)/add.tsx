// app/(tabs)/add.tsx
// Tela de adicionar transação — salva no store global

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ImageBackground,
  StatusBar, Image
} from 'react-native';
import { estilosLogin } from '../../src/styles/_estilosLogin';
import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';

const DESPESAS = [
  { id: 'alimentacao', label: 'Alimentação', emoji: '🍔' },
  { id: 'entretenimento', label: 'Entretenimento', emoji: '🎮' },
  { id: 'lazer', label: 'Lazer', emoji: '🌴' },
  { id: 'transporte', label: 'Transporte', emoji: '🚗' },
  { id: 'saude', label: 'Saúde', emoji: '💊' },
  { id: 'educacao', label: 'Educação', emoji: '📚' },
  { id: 'moradia', label: 'Moradia', emoji: '🏠' },
  { id: 'outros', label: 'Outros', emoji: '📦' },
];

const RECEITAS = [
  { id: 'salario', label: 'Salário', emoji: '💼' },
  { id: 'freelance', label: 'Freelance', emoji: '💻' },
  { id: 'investimento', label: 'Investimento', emoji: '📈' },
  { id: 'presente', label: 'Presente', emoji: '🎁' },
  { id: 'outros', label: 'Outros', emoji: '📦' },
];

export default function Add() {
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'despesa' | 'receita'>('despesa');
  const [categoria, setCategoria] = useState('');
  const [abrirCat, setAbrirCat] = useState(false);
  const [descricaoOutros, setDescricaoOutros] = useState('');

  const {
    adicionarTransacao,
    removerTransacao,
    ultimasTransacoes,
    totalReceitas,
    totalDespesas,
  } = useTransacoesStore();

  const lista = ultimasTransacoes(50);
  const categorias = tipo === 'despesa' ? DESPESAS : RECEITAS;
  const catAtual = categorias.find(c => c.id === categoria);

  function formatarValor(texto: string) {
    const n = texto.replace(/\D/g, '');
    if (!n) return '';
    return `R$ ${(parseInt(n) / 100).toFixed(2).replace('.', ',')}`;
  }

  function textoParaNumero(v: string) {
    return parseFloat(v.replace('R$ ', '').replace(',', '.') || '0');
  }

  function salvar() {
    if (!valor) return Alert.alert('Erro', 'Informe o valor!');
    if (!categoria) return Alert.alert('Erro', 'Selecione uma categoria!');

    if (categoria === 'outros' && !descricaoOutros.trim()) {
      return Alert.alert('Erro', 'Descreva o item!');
    }

    const cat = categorias.find(c => c.id === categoria)!;

    const nomeCategoria =
      categoria === 'outros' && descricaoOutros.trim()
        ? descricaoOutros.trim()
        : cat.label;

    const numeroValor = textoParaNumero(valor);

    adicionarTransacao({
      valor: numeroValor,
      valorFormatado: valor,
      tipo,
      categoriaId: cat.id,
      categoriaLabel: nomeCategoria,
      emoji: cat.emoji,
    });

    setValor('');
    setCategoria('');
    setAbrirCat(false);
    setTipo('despesa');
    setDescricaoOutros('');

    Alert.alert('✅ Salvo!', `${cat.emoji} ${nomeCategoria} — ${valor} registrado.`);
  }

  function excluir(id: string) {
    Alert.alert('Excluir', 'Remover esta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removerTransacao(id) },
    ]);
  }

  const receitasTotal = totalReceitas();
  const despesasTotal = totalDespesas();
  const saldoTotal = receitasTotal - despesasTotal;

  return (
    <ImageBackground source={require('../../assets/Fundo.png')} style={estilosLogin.imagemFundo}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.container}>

          <View style={s.topo}>
            <Image
              source={require('../assets/logo.png')}
              style={s.logo}
              resizeMode="contain"
            />
            <Text style={s.titulo}>Nova Transação</Text>
          </View>

          <View style={s.tipoContainer}>
            <TouchableOpacity
              style={[s.tipoBotao, tipo === 'receita' && s.receita]}
              onPress={() => {
                setTipo('receita');
                setCategoria('');
                setDescricaoOutros('');
              }}
            >
              <Text style={s.tipoTexto}>💰 Receita</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.tipoBotao, tipo === 'despesa' && s.despesa]}
              onPress={() => {
                setTipo('despesa');
                setCategoria('');
                setDescricaoOutros('');
              }}
            >
              <Text style={s.tipoTexto}>💸 Despesa</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.catBotao} onPress={() => setAbrirCat(!abrirCat)}>
            <Text style={[s.catBotaoTexto, catAtual && s.catBotaoTextoAtivo]}>
              {catAtual ? `${catAtual.emoji}  ${catAtual.label}` : 'Selecionar categoria'}
            </Text>
            <Text style={s.seta}>{abrirCat ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {abrirCat && (
            <View style={s.grid}>
              {categorias.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[s.catItem, categoria === cat.id && s.catItemAtivo]}
                  onPress={() => {
                    setCategoria(cat.id);
                    setAbrirCat(false);

                    if (cat.id !== 'outros') {
                      setDescricaoOutros('');
                    }
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{cat.emoji}</Text>
                  <Text style={[s.catLabel, categoria === cat.id && s.catLabelAtivo]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {categoria === 'outros' && (
            <TextInput
              style={s.input}
              placeholder="Descreva o item"
              placeholderTextColor="#667"
              value={descricaoOutros}
              onChangeText={setDescricaoOutros}
            />
          )}

          <TextInput
            style={s.input}
            placeholder="Valor (R$)"
            placeholderTextColor="#667"
            keyboardType="numeric"
            value={valor}
            onChangeText={t => setValor(formatarValor(t))}
          />

          <TouchableOpacity style={s.botao} onPress={salvar}>
            <Text style={s.botaoTexto}>Salvar Transação</Text>
          </TouchableOpacity>

          {lista.length > 0 && (
            <View style={{ marginTop: 30 }}>
              <View style={s.resumo}>
                <View style={s.resumoItem}>
                  <Text style={s.resumoLabel}>Receitas</Text>
                  <Text style={[s.resumoValor, { color: '#4CAF50' }]}>
                    + R$ {receitasTotal.toFixed(2).replace('.', ',')}
                  </Text>
                </View>

                <View style={s.divider} />

                <View style={s.resumoItem}>
                  <Text style={s.resumoLabel}>Despesas</Text>
                  <Text style={[s.resumoValor, { color: '#F44336' }]}>
                    - R$ {despesasTotal.toFixed(2).replace('.', ',')}
                  </Text>
                </View>

                <View style={s.divider} />

                <View style={s.resumoItem}>
                  <Text style={s.resumoLabel}>Saldo</Text>
                  <Text style={[s.resumoValor, { color: saldoTotal >= 0 ? '#4CAF50' : '#F44336' }]}>
                    R$ {saldoTotal.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>

              <Text style={s.secaoLabel}>Lançamentos</Text>

              {lista.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={s.card}
                  onLongPress={() => excluir(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={[s.cardLinha, { backgroundColor: item.tipo === 'receita' ? '#4CAF50' : '#F44336' }]} />

                  <Text style={{ fontSize: 22, paddingHorizontal: 12 }}>
                    {item.emoji}
                  </Text>

                  <View style={{ flex: 1, paddingVertical: 14 }}>
                    <Text style={s.cardLabel}>{item.categoriaLabel}</Text>
                    <Text style={s.cardTipo}>
                      {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </Text>
                  </View>

                  <Text style={[s.cardValor, { color: item.tipo === 'receita' ? '#4CAF50' : '#F44336' }]}>
                    {item.tipo === 'receita' ? '+' : '-'} {item.valorFormatado}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={s.dica}>Pressione e segure para excluir</Text>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center', paddingTop: 50 },
  topo: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 120, height: 120, marginTop: -240 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#fff' },
  tipoContainer: { flexDirection: 'row', marginBottom: 14, gap: 10 },
  tipoBotao: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  receita: { backgroundColor: '#4CAF50' },
  despesa: { backgroundColor: '#F44336' },
  tipoTexto: { color: '#fff', fontWeight: 'bold' },
  catBotao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', padding: 15, borderRadius: 10, marginBottom: 10 },
  catBotaoTexto: { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
  catBotaoTextoAtivo: { color: '#7ab0ff' },
  seta: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, marginBottom: 10 },
  catItem: { width: '22%', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 4, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  catItemAtivo: { backgroundColor: 'rgba(100,160,255,0.18)', borderColor: '#4e82f7' },
  catLabel: { fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 4, textAlign: 'center' },
  catLabelAtivo: { color: '#7ab0ff', fontWeight: '600' },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', padding: 15, borderRadius: 10, marginBottom: 15, color: '#fff', fontSize: 18 },
  botao: { backgroundColor: '#2176ff', padding: 16, borderRadius: 10, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resumo: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 20, justifyContent: 'space-between', alignItems: 'center' },
  resumoItem: { flex: 1, alignItems: 'center' },
  resumoLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 },
  resumoValor: { fontSize: 13, fontWeight: 'bold' },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' },
  secaoLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  cardLinha: { width: 4, alignSelf: 'stretch' },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#fff' },
  cardTipo: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  cardValor: { fontSize: 14, fontWeight: 'bold', paddingRight: 14 },
  dica: { textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8 },
});