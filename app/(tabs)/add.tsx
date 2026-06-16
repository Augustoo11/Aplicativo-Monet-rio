import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { API_URL, CORES } from '../../src/config';

type Categoria = {
  id: string;
  nome: string;
  tipo: string;
};

// Como o banco retorna uma transação
type Transacao = {
  id: string;
  tipo: string;
  valor: number;
  descricao: string;
  data: string;
  categoria: Categoria;
};

// ─────────────────────────────────────────────────────────────

export default function Add() {
  // ── Estados do formulário ──
  const [tipo, setTipo] = useState<'despesa' | 'receita'>('despesa');
  const [valor, setValor] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
  const [descricao, setDescricao] = useState('');

  // ── Dados vindos da API ──
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  // ── Estados de carregamento ──
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(false);

  // ─── Ao abrir a tela: busca tudo ──────────────────────────────
  useEffect(() => {
    carregarDados();
  }, []);

  // Quando o tipo muda (receita/despesa), limpa a categoria
  useEffect(() => {
    setCategoriaSelecionada(null);
  }, [tipo]);

  async function carregarDados() {
    const id = await AsyncStorage.getItem('@usuario_id');
    setUsuarioId(id);
    await buscarCategorias();
    if (id) await buscarTransacoes(id);
  }

  // ─── Busca categorias do banco ───────────────────────────────
  async function buscarCategorias() {
    try {
      setCarregandoCategorias(true);
      const resposta = await fetch(`${API_URL}/categorias`);
      const dados: Categoria[] = await resposta.json();
      setCategorias(dados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    } finally {
      setCarregandoCategorias(false);
    }
  }

  // ─── Busca transações do usuário ─────────────────────────────
  async function buscarTransacoes(id: string) {
    try {
      setCarregandoLista(true);
      const resposta = await fetch(`${API_URL}/transacoes/usuario/${id}`);
      const dados: Transacao[] = await resposta.json();

      // Ordena da mais recente para a mais antiga
      const ordenadas = dados.sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      setTransacoes(ordenadas);
    } catch (erro) {
      console.log('Erro ao buscar transações:', erro);
    } finally {
      setCarregandoLista(false);
    }
  }

  // ─── Formata o valor enquanto o usuário digita ────────────────
  // Ex: digita "15000" → mostra "R$ 150,00"
  function formatarValorInput(texto: string) {
    const somenteNumeros = texto.replace(/\D/g, '');
    if (!somenteNumeros) return '';
    const numero = parseInt(somenteNumeros) / 100;
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
  }

  // ─── Converte "R$ 50,00" para 50.00 ──────────────────────────
  function textoParaNumero(texto: string): number {
    return parseFloat(texto.replace('R$ ', '').replace(',', '.') || '0');
  }

  // ─── Salva a transação no banco ───────────────────────────────
  async function salvar() {
    if (!valor) return Alert.alert('Erro', 'Informe o valor.');
    if (!categoriaSelecionada) return Alert.alert('Erro', 'Selecione uma categoria.');
    if (!usuarioId) return Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');

    setSalvando(true);

    try {
      const hoje = new Date().toISOString().split('T')[0]; // "2026-06-04"

      // Monta o JSON que o backend espera
      const novaTransacao = {
        usuario: { id: usuarioId },
        categoria: { id: categoriaSelecionada.id },
        tipo: tipo,
        valor: textoParaNumero(valor),
        descricao: descricao || categoriaSelecionada.nome,
        data: hoje,
      };

      const resposta = await fetch(`${API_URL}/transacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTransacao),
      });

      if (resposta.ok || resposta.status === 201) {
        // Limpa o formulário
        setValor('');
        setDescricao('');
        setCategoriaSelecionada(null);

        Alert.alert('Salvo!', `${categoriaSelecionada.nome} — ${valor} registrado!`);

        // Atualiza a lista de transações
        await buscarTransacoes(usuarioId!);
      } else {
        const mensagem = await resposta.text();
        Alert.alert('Erro', mensagem || 'Não foi possível salvar a transação.');
      }
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Verifique se o backend está rodando.');
    } finally {
      setSalvando(false);
    }
  }

  // ─── Cálculos do resumo ───────────────────────────────────────
  const totalReceitas = transacoes
    .filter((t) => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0);

  const saldoAtual = totalReceitas - totalDespesas;

  // ─── Formata valor para exibição na lista ─────────────────────
  function formatarMoeda(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ─── Categorias filtradas pelo tipo selecionado ───────────────
  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo);

  // ─── Renderização ─────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Título da tela */}
          <Text style={styles.tituloPagina}>Nova Transação</Text>

          {/* Seleção de tipo: Receita ou Despesa */}
          <View style={styles.filhaTipo}>
            <TouchableOpacity
              style={[styles.botaoTipo, tipo === 'receita' && { backgroundColor: CORES.verde, borderColor: CORES.verde }]}
              onPress={() => setTipo('receita')}
            >
              <Text style={[styles.textoTipo, tipo === 'receita' && { color: '#fff' }]}>Receita</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoTipo, tipo === 'despesa' && { backgroundColor: CORES.vermelho, borderColor: CORES.vermelho }]}
              onPress={() => setTipo('despesa')}
            >
              <Text style={[styles.textoTipo, tipo === 'despesa' && { color: '#fff' }]}>Despesa</Text>
            </TouchableOpacity>
          </View>

          {/* Seleção de categoria — lista de botões clicáveis */}
          <Text style={styles.labelCampo}>Categoria</Text>

          {carregandoCategorias ? (
            <ActivityIndicator color={CORES.azul} style={{ marginBottom: 16 }} />
          ) : (
            <View style={styles.gradeCategorias}>
              {categoriasFiltradas.length === 0 ? (
                <Text style={{ color: CORES.textoEscuro }}>Nenhuma categoria encontrada.</Text>
              ) : (
                categoriasFiltradas.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.botaoCategoria,
                      categoriaSelecionada?.id === cat.id && styles.botaoCategoriaAtivo,
                    ]}
                    onPress={() => setCategoriaSelecionada(cat)}
                  >
                    <Text style={[
                      styles.textoCategoria,
                      categoriaSelecionada?.id === cat.id && styles.textoCategoriaAtivo,
                    ]}>
                      {cat.nome}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* Campo de valor — já mostra "R$" */}
          <Text style={styles.labelCampo}>Valor</Text>
          <TextInput
            style={styles.input}
            placeholder="R$ 0,00"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={valor}
            onChangeText={(t) => setValor(formatarValorInput(t))}
          />

          {/* Campo de descrição (opcional) */}
          <Text style={styles.labelCampo}>Descrição (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Almoço com amigos"
            placeholderTextColor="#6b7280"
            value={descricao}
            onChangeText={setDescricao}
          />

          {/* Botão de salvar */}
          <TouchableOpacity
            style={[styles.botaoSalvar, salvando && { opacity: 0.7 }]}
            onPress={salvar}
            disabled={salvando}
          >
            {salvando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.textoSalvar}>Salvar</Text>
            }
          </TouchableOpacity>

          {/* ── Resumo financeiro ── */}
          {transacoes.length > 0 && (
            <View style={styles.resumo}>
              <View style={styles.itemResumo}>
                <Text style={styles.labelResumo}>Receitas</Text>
                <Text style={[styles.valorResumo, { color: CORES.verde }]}>{formatarMoeda(totalReceitas)}</Text>
              </View>
              <View style={styles.divisorResumo} />
              <View style={styles.itemResumo}>
                <Text style={styles.labelResumo}>Despesas</Text>
                <Text style={[styles.valorResumo, { color: CORES.vermelho }]}>{formatarMoeda(totalDespesas)}</Text>
              </View>
              <View style={styles.divisorResumo} />
              <View style={styles.itemResumo}>
                <Text style={styles.labelResumo}>Saldo</Text>
                <Text style={[styles.valorResumo, { color: saldoAtual >= 0 ? CORES.verde : CORES.vermelho }]}>
                  {formatarMoeda(saldoAtual)}
                </Text>
              </View>
            </View>
          )}

          {/* ── Lista de transações do banco ── */}
          {transacoes.length > 0 && (
            <>
              <Text style={styles.labelSecao}>HISTÓRICO DO BANCO</Text>

              {carregandoLista
                ? <ActivityIndicator color={CORES.azul} style={{ marginTop: 20 }} />
                : transacoes.map((item) => (
                  <View key={item.id} style={styles.itemTransacao}>
                    {/* Barra colorida à esquerda */}
                    <View style={[styles.barraCor, { backgroundColor: item.tipo === 'receita' ? CORES.verde : CORES.vermelho }]} />

                    {/* Ícone */}
                    <Ionicons
                      name={item.tipo === 'receita' ? 'wallet-outline' : 'arrow-down-outline'}
                      size={20}
                      color={item.tipo === 'receita' ? CORES.verde : CORES.vermelho}
                      style={{ paddingHorizontal: 12 }}
                    />

                    {/* Informações */}
                    <View style={{ flex: 1, paddingVertical: 14 }}>
                      <Text style={styles.nomeTransacao}>{item.categoria?.nome || item.descricao}</Text>
                      <Text style={styles.dataTransacao}>{item.tipo} • {item.data}</Text>
                    </View>

                    {/* Valor */}
                    <Text style={[styles.valorTransacao, { color: item.tipo === 'receita' ? CORES.verde : CORES.vermelho }]}>
                      {item.tipo === 'receita' ? '+' : '-'} {formatarMoeda(item.valor)}
                    </Text>
                  </View>
                ))
              }
            </>
          )}

          {/* Mensagem quando não tem transações */}
          {transacoes.length === 0 && !carregandoLista && (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: CORES.textoEscuro, fontSize: 14 }}>
                Nenhuma transação registrada ainda.
              </Text>
              <Text style={{ color: CORES.textoEscuro, fontSize: 12, marginTop: 4 }}>
                Adicione sua primeira receita ou despesa acima!
              </Text>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Estilos ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  scroll: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },

  // Título
  tituloPagina: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CORES.textoClaro,
    marginBottom: 24,
    textAlign: 'center',
  },

  // Tipo (Receita / Despesa)
  filhaTipo: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  botaoTipo: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  textoTipo: {
    color: CORES.textoMedio,
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Categorias
  labelCampo: {
    color: CORES.textoMedio,
    fontSize: 13,
    marginBottom: 10,
  },
  gradeCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  botaoCategoria: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: CORES.cartao,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  botaoCategoriaAtivo: {
    backgroundColor: CORES.azul,
    borderColor: CORES.azul,
  },
  textoCategoria: {
    color: CORES.textoMedio,
    fontSize: 13,
  },
  textoCategoriaAtivo: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Inputs
  input: {
    backgroundColor: CORES.cartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    color: CORES.textoClaro,
    fontSize: 16,
  },

  // Botão salvar
  botaoSalvar: {
    backgroundColor: CORES.azul,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 28,
  },
  textoSalvar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Resumo financeiro
  resumo: {
    flexDirection: 'row',
    backgroundColor: CORES.cartao,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  itemResumo: {
    flex: 1,
    alignItems: 'center',
  },
  labelResumo: {
    fontSize: 11,
    color: CORES.textoEscuro,
    marginBottom: 4,
  },
  valorResumo: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  divisorResumo: {
    width: 1,
    height: 30,
    backgroundColor: CORES.borda,
  },

  // Label de seção
  labelSecao: {
    fontSize: 11,
    fontWeight: '700',
    color: CORES.textoEscuro,
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Item de transação na lista
  itemTransacao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  barraCor: {
    width: 4,
    alignSelf: 'stretch',
  },
  nomeTransacao: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textoClaro,
  },
  dataTransacao: {
    fontSize: 11,
    color: CORES.textoEscuro,
    marginTop: 2,
  },
  valorTransacao: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingRight: 14,
  },
});
