// app/(tabs)/home.tsx
// ─────────────────────────────────────────────────────────────
// Tela principal do app (Home).
// Mostra o saldo, receitas, despesas e a lista de transações.
// Também tem a tela de Metas.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';
import PerfilModal from '../../src/componentes/PerfilModal';
import { API_URL, CATEGORIAS_DESPESA, CATEGORIAS_RECEITA, CORES } from '../../src/config';

// ─── Tipos ────────────────────────────────────────────────────
// Formato de uma categoria vinda do banco
type Categoria = {
  id: number;
  nome: string;
  tipo: string;
};

// Formato de uma meta financeira (salva apenas na memória)
type Meta = {
  id: number;
  nome: string;
  valor: number;
};

// ─────────────────────────────────────────────────────────────
export default function Home() {
  // Dados do store global (transações, saldo, etc.)
  const { totalReceitas, totalDespesas, saldo, transacoes, setTransacoesDoBanco } =
    useTransacoesStore();

  const router = useRouter();

  // ── Aba ativa: "inicio" ou "metas"
  const [abaAtiva, setAbaAtiva] = useState<'inicio' | 'metas'>('inicio');

  // ── Dados do usuário logado
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  // ── Modais
  const [modalTransacao, setModalTransacao] = useState(false);
  const [modalMeta, setModalMeta] = useState(false);
  const [modalPerfil, setModalPerfil] = useState(false);

  // ── Formulário de nova transação
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);

  // ── Categorias vindas do banco
  const [categoriasDoBanco, setCategoriasDoBanco] = useState<Categoria[]>([]);

  // ── Metas (apenas na memória por enquanto)
  const [metas, setMetas] = useState<Meta[]>([]);
  const [nomeMeta, setNomeMeta] = useState('');
  const [valorMeta, setValorMeta] = useState('');

  // ── Filtro da lista de transações
  const [filtro, setFiltro] = useState<'todos' | 'receita' | 'despesa'>('todos');

  // ─── Ao abrir o app: carrega dados do usuário e transações ────
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  // Quando o tipo (receita/despesa) muda, limpa a categoria selecionada
  useEffect(() => {
    setCategoriaSelecionada(null);
  }, [tipo]);

  async function carregarDadosIniciais() {
    // Pega os dados salvos no login
    const nome = await AsyncStorage.getItem('@usuario_nome');
    const email = await AsyncStorage.getItem('@usuario_email');
    const id = await AsyncStorage.getItem('@usuario_id');

    if (nome) setNomeUsuario(nome);
    if (email) setEmailUsuario(email);
    setUsuarioId(id);

    // Busca categorias e transações do banco
    await buscarCategorias();
    if (id) await buscarTransacoes(id);
  }

  // ─── Busca todas as transações do usuário no banco ────────────
  async function buscarTransacoes(idDoUsuario: string) {
    try {
      const resposta = await fetch(`${API_URL}/transacoes/usuario/${idDoUsuario}`);

      if (resposta.ok) {
        const dados = await resposta.json();

        // Converte o formato do banco para o formato do app
        const formatadas = dados.map((t: any) => ({
          id: String(t.id),
          tipo: t.tipo,
          valor: t.valor,
          valorFormatado: formatarMoeda(t.valor),
          categoriaId: String(t.categoria.id),
          categoriaLabel: t.categoria.nome,
          descricao: t.descricao,
          data: new Date(t.data + 'T00:00:00'),
        }));

        setTransacoesDoBanco(formatadas);
      }
    } catch (erro) {
      console.log('Erro ao buscar transações:', erro);
    }
  }

  // ─── Busca categorias do banco ───────────────────────────────
  async function buscarCategorias() {
    try {
      const resposta = await fetch(`${API_URL}/categorias`);
      if (resposta.ok) {
        const dados = await resposta.json();
        setCategoriasDoBanco(dados);
      }
    } catch (erro) {
      console.log('Erro ao buscar categorias:', erro);
    }
  }

  // ─── Salva uma nova transação no banco ───────────────────────
  async function salvarTransacao() {
    // Validações antes de salvar
    if (!categoriaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma categoria.');
      return;
    }
    if (!valor) {
      Alert.alert('Atenção', 'Informe o valor.');
      return;
    }
    if (!usuarioId) {
      Alert.alert('Erro', 'Usuário não identificado. Refaça o login.');
      return;
    }

    // Converte "R$ 150,00" para 150.00
    const valorNumerico = textoParaNumero(valor);

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    setSalvando(true);

    try {
      const hoje = new Date().toISOString().split('T')[0]; // "2026-06-04"

      // Monta o JSON que o backend espera
      const novaTransacao = {
        usuario: { id: usuarioId },
        categoria: { id: categoriaSelecionada.id },
        tipo: tipo,
        valor: valorNumerico,
        descricao: descricao || categoriaSelecionada.nome,
        data: hoje,
      };

      const resposta = await fetch(`${API_URL}/transacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTransacao),
      });

      if (resposta.ok || resposta.status === 201) {
        // Sucesso! Atualiza a lista e fecha o modal
        await buscarTransacoes(usuarioId);
        Alert.alert('Salvo!', 'Transação registrada com sucesso!');
        limparFormulario();
      } else {
        const mensagem = await resposta.text();
        Alert.alert('Erro', mensagem || 'Não foi possível salvar.');
      }
    } catch (erro) {
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setSalvando(false);
    }
  }

  // ─── Salva uma meta na memória ───────────────────────────────
  function salvarMeta() {
    if (!nomeMeta || !valorMeta) {
      Alert.alert('Atenção', 'Preencha o nome e o valor da meta.');
      return;
    }

    const valorNumerico = Number(valorMeta.replace(',', '.'));

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    setMetas([...metas, { id: Date.now(), nome: nomeMeta, valor: valorNumerico }]);
    setNomeMeta('');
    setValorMeta('');
    setModalMeta(false);
  }

  // ─── Remove uma meta da lista ────────────────────────────────
  function excluirMeta(id: number) {
    setMetas(metas.filter((m) => m.id !== id));
  }

  // ─── Desloga o usuário ───────────────────────────────────────
  async function sairDaConta() {
    await AsyncStorage.multiRemove(['@usuario_id', '@usuario_nome', '@usuario_email']);
    setModalPerfil(false);
    router.replace('/');
  }

  // ─── Limpa o formulário de transação e fecha o modal ─────────
  function limparFormulario() {
    setValor('');
    setDescricao('');
    setCategoriaSelecionada(null);
    setTipo('despesa');
    setModalTransacao(false);
  }

  // ─── Formata valor enquanto digita ───────────────────────────
  // Ex: digita "15000" → mostra "R$ 150,00"
  function formatarValorInput(texto: string) {
    const somenteNumeros = texto.replace(/\D/g, '');
    if (!somenteNumeros) return '';
    const numero = parseInt(somenteNumeros) / 100;
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
  }

  // ─── Converte texto formatado para número ─────────────────────
  // Ex: "R$ 150,00" → 150.00
  function textoParaNumero(texto: string): number {
    return parseFloat(texto.replace('R$ ', '').replace(',', '.') || '0');
  }

  // ─── Formata número para moeda brasileira ────────────────────
  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ─── Cálculos do resumo financeiro ───────────────────────────
  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();

  // Lista de transações ordenada da mais nova para a mais antiga
  const listaOrdenada = [...transacoes].sort((a, b) => b.data.getTime() - a.data.getTime());

  // Aplica o filtro selecionado
  const listaFiltrada = listaOrdenada.filter((item) => {
    if (filtro === 'todos') return true;
    return item.tipo === filtro;
  });

  // Pega só o primeiro nome para o cumprimento
  const primeiroNome = nomeUsuario.split(' ')[0];

  // Iniciais para o avatar (ex: "João Silva" → "JS")
  const iniciaisUsuario = nomeUsuario
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  // Mês atual formatado (ex: "Junho 2026")
  const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const mesFormatado = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);

  // Lista de categorias filtradas pelo tipo selecionado no formulário
  const categoriasFiltradas = categoriasDoBanco.filter((c) => c.tipo === tipo);

  // ─── Renderização da tela ─────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>

        {/* ── Cabeçalho com logo e avatar ── */}
        <View style={styles.cabecalho}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.logoBox}>
              <Image
                source={require('../../src/assets/logo.png')}
                style={{ width: 20, height: 20, tintColor: '#fff' }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.logoTexto}>GestorFin</Text>
          </View>

          {/* Avatar — abre o modal de perfil */}
          <TouchableOpacity style={styles.avatar} onPress={() => setModalPerfil(true)}>
            <Text style={styles.avatarTexto}>{iniciaisUsuario}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Conteúdo rolável ── */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

          {/* ── ABA INÍCIO ── */}
          {abaAtiva === 'inicio' && (
            <>
              {/* Saudação e mês */}
              <Text style={styles.saudacao}>Olá, {primeiroNome} · {mesFormatado}</Text>

              {/* Saldo principal */}
              <Text
                style={[styles.saldo, { color: saldoAtual >= 0 ? CORES.verde : CORES.vermelho }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatarMoeda(saldoAtual)}
              </Text>
              <Text style={styles.labelSaldo}>saldo do mês</Text>

              {/* Cartões de receita e despesa */}
              <View style={styles.filhaCartoes}>
                <View style={styles.cartao}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View style={[styles.bolinha, { backgroundColor: CORES.verde }]} />
                    <Text style={styles.labelCartao}>Receitas</Text>
                  </View>
                  <Text style={[styles.valorCartao, { color: CORES.verde }]} numberOfLines={1} adjustsFontSizeToFit>
                    {formatarMoeda(receitas)}
                  </Text>
                </View>

                <View style={styles.cartao}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View style={[styles.bolinha, { backgroundColor: CORES.vermelho }]} />
                    <Text style={styles.labelCartao}>Despesas</Text>
                  </View>
                  <Text style={[styles.valorCartao, { color: CORES.vermelho }]} numberOfLines={1} adjustsFontSizeToFit>
                    {formatarMoeda(despesas)}
                  </Text>
                </View>
              </View>

              {/* Título da seção de transações */}
              <Text style={styles.tituloSecao}>TRANSAÇÕES</Text>

              {/* Botões de filtro */}
              <View style={styles.areaFiltro}>
                {(['todos', 'receita', 'despesa'] as const).map((opcao) => (
                  <TouchableOpacity
                    key={opcao}
                    style={[styles.botaoFiltro, filtro === opcao && styles.botaoFiltroAtivo]}
                    onPress={() => setFiltro(opcao)}
                  >
                    <Text style={[styles.textoFiltro, filtro === opcao && styles.textoFiltroAtivo]}>
                      {opcao === 'todos' ? 'Todos' : opcao === 'receita' ? 'Receitas' : 'Despesas'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mensagem quando não há transações */}
              {listaFiltrada.length === 0 && (
                <Text style={styles.textoVazio}>Nenhuma transação encontrada.</Text>
              )}

              {/* Lista de transações (máximo 10) */}
              {listaFiltrada.slice(0, 10).map((item) => (
                <View style={styles.itemTransacao} key={item.id}>
                  <View style={styles.iconeTransacao}>
                    <Ionicons
                      name={item.tipo === 'receita' ? 'wallet-outline' : 'arrow-down-outline'}
                      size={20}
                      color={item.tipo === 'receita' ? CORES.verde : CORES.vermelho}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nomeTransacao}>{item.categoriaLabel}</Text>
                    <Text style={styles.dataTransacao}>{item.data.toLocaleDateString('pt-BR')}</Text>
                  </View>
                  <Text
                    style={[styles.valorTransacao, { color: item.tipo === 'receita' ? CORES.verde : CORES.vermelho }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {item.tipo === 'receita' ? '+' : '-'}{item.valorFormatado}
                  </Text>
                </View>
              ))}
            </>
          )}

          {/* ── ABA METAS ── */}
          {abaAtiva === 'metas' && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={styles.tituloAba}>Metas</Text>
                <TouchableOpacity onPress={() => setModalMeta(true)}>
                  <Text style={{ color: CORES.azul, fontSize: 14, fontWeight: 'bold' }}>Nova meta</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.descricaoAba}>
                Acompanhe suas metas usando o saldo atual do app.
              </Text>

              {/* Quando não há metas */}
              {metas.length === 0 && (
                <View style={styles.caixaVazioMeta}>
                  <Text style={styles.textoVazio}>Nenhuma meta criada ainda.</Text>
                  <TouchableOpacity style={styles.botaoPrimeiraMeta} onPress={() => setModalMeta(true)}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Criar primeira meta</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Lista de metas */}
              {metas.map((meta) => {
                // Calcula o progresso da meta em relação ao saldo atual
                const progresso = saldoAtual <= 0 ? 0 : Math.min((saldoAtual / meta.valor) * 100, 100);
                const falta = meta.valor - saldoAtual;
                const concluida = progresso >= 100;

                return (
                  <View style={styles.cartaoMeta} key={meta.id}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <View>
                        <Text style={styles.nomeTransacao}>{meta.nome}</Text>
                        <Text style={{ color: concluida ? CORES.verde : '#FACC15', fontSize: 12, marginTop: 2, fontWeight: 'bold' }}>
                          {concluida ? 'Meta alcançada!' : 'Em andamento'}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => excluirMeta(meta.id)}>
                        <Ionicons name="trash-outline" size={22} color={CORES.vermelho} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.dataTransacao}>Objetivo: {formatarMoeda(meta.valor)}</Text>
                    <Text style={styles.dataTransacao}>Saldo atual: {formatarMoeda(saldoAtual)}</Text>
                    {!concluida && <Text style={styles.dataTransacao}>Falta: {formatarMoeda(falta)}</Text>}

                    {/* Barra de progresso */}
                    <View style={styles.barraFundo}>
                      <View style={[styles.barraProgresso, { width: `${progresso}%` }]} />
                    </View>
                    <Text style={[styles.dataTransacao, { marginTop: 8 }]}>{progresso.toFixed(0)}% concluído</Text>

                    {concluida && (
                      <View style={styles.caixaMetaConcluida}>
                        <Text style={{ color: CORES.verde, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>
                          Parabéns! Você atingiu esse objetivo.
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>

        {/* ── Barra de navegação inferior ── */}
        <View style={styles.barraInferior}>
          <TouchableOpacity style={styles.botaoNav} onPress={() => setAbaAtiva('inicio')}>
            <FontAwesome5 name="th-large" size={20} color={abaAtiva === 'inicio' ? CORES.azul : CORES.textoEscuro} />
            <Text style={[styles.textoNav, { color: abaAtiva === 'inicio' ? CORES.azul : CORES.textoEscuro }]}>Início</Text>
          </TouchableOpacity>

          {/* Botão central de adicionar transação */}
          <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalTransacao(true)}>
            <FontAwesome5 name="plus" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoNav} onPress={() => setAbaAtiva('metas')}>
            <Ionicons name="flag-outline" size={22} color={abaAtiva === 'metas' ? CORES.azul : CORES.textoEscuro} />
            <Text style={[styles.textoNav, { color: abaAtiva === 'metas' ? CORES.azul : CORES.textoEscuro }]}>Metas</Text>
          </TouchableOpacity>
        </View>

        {/* ── Modal: Perfil do usuário ── */}
        <PerfilModal
          visible={modalPerfil}
          onClose={() => setModalPerfil(false)}
          nome={nomeUsuario}
          email={emailUsuario}
          usuarioId={usuarioId}
          onSair={sairDaConta}
        />

        {/* ── Modal: Nova Transação ── */}
        <Modal visible={modalTransacao} transparent animationType="slide">
          <View style={styles.overlayModal}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.conteudoModal}>
                  <View style={styles.alcaModal} />
                  <Text style={styles.tituloModal}>Nova Transação</Text>

                  {/* Seleção do tipo: Receita ou Despesa */}
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
                  <View style={styles.gradeCategorias}>
                    {categoriasFiltradas.map((cat) => (
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
                    ))}
                  </View>

                  {/* Campo de valor com "R$" já visível */}
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

                  {/* Botões de ação */}
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                    <TouchableOpacity style={styles.botaoCancelar} onPress={limparFormulario} disabled={salvando}>
                      <Text style={styles.textoCancelar}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.botaoSalvar, salvando && { opacity: 0.7 }]}
                      onPress={salvarTransacao}
                      disabled={salvando}
                    >
                      {salvando
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.textoSalvar}>Salvar</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* ── Modal: Nova Meta ── */}
        <Modal visible={modalMeta} transparent animationType="slide">
          <View style={styles.overlayModal}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
              <View style={styles.conteudoModal}>
                <View style={styles.alcaModal} />
                <Text style={styles.tituloModal}>Nova Meta</Text>

                <Text style={styles.labelCampo}>Nome da meta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Viagem, Notebook, Carro..."
                  placeholderTextColor="#6b7280"
                  value={nomeMeta}
                  onChangeText={setNomeMeta}
                />

                <Text style={styles.labelCampo}>Valor objetivo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 5000"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  value={valorMeta}
                  onChangeText={setValorMeta}
                />

                <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                  <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalMeta(false)}>
                    <Text style={styles.textoCancelar}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.botaoSalvar} onPress={salvarMeta}>
                    <Text style={styles.textoSalvar}>Salvar Meta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBox: {
    width: 35,
    height: 35,
    backgroundColor: CORES.azul,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES.textoClaro,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CORES.cartao,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  avatarTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Saudação e saldo
  saudacao: {
    color: CORES.textoMedio,
    fontSize: 14,
    marginBottom: 6,
  },
  saldo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  labelSaldo: {
    color: CORES.textoEscuro,
    fontSize: 12,
    marginBottom: 24,
  },

  // Cartões de receita/despesa
  filhaCartoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 12,
  },
  cartao: {
    flex: 1,
    backgroundColor: CORES.cartao,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  bolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  labelCartao: {
    color: CORES.textoMedio,
    fontSize: 13,
  },
  valorCartao: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Seção de transações
  tituloSecao: {
    color: CORES.textoEscuro,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 14,
  },

  // Filtros
  areaFiltro: {
    flexDirection: 'row',
    marginBottom: 18,
    gap: 10,
  },
  botaoFiltro: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: CORES.cartao,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  botaoFiltroAtivo: {
    backgroundColor: CORES.azul,
    borderColor: CORES.azul,
  },
  textoFiltro: {
    color: CORES.textoMedio,
    fontSize: 13,
  },
  textoFiltroAtivo: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Item de transação
  itemTransacao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  iconeTransacao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CORES.fundo,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  nomeTransacao: {
    color: CORES.textoClaro,
    fontSize: 15,
    fontWeight: 'bold',
  },
  dataTransacao: {
    color: CORES.textoEscuro,
    fontSize: 12,
    marginTop: 4,
  },
  valorTransacao: {
    fontSize: 15,
    fontWeight: 'bold',
    maxWidth: 110,
  },

  // Texto quando lista está vazia
  textoVazio: {
    color: CORES.textoEscuro,
    textAlign: 'center',
    marginTop: 20,
  },

  // Aba de metas
  tituloAba: {
    color: CORES.textoClaro,
    fontSize: 22,
    fontWeight: 'bold',
  },
  descricaoAba: {
    color: CORES.textoMedio,
    fontSize: 13,
    marginBottom: 20,
  },
  caixaVazioMeta: {
    backgroundColor: CORES.cartao,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.borda,
    marginTop: 10,
  },
  botaoPrimeiraMeta: {
    marginTop: 14,
    backgroundColor: CORES.azul,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  cartaoMeta: {
    backgroundColor: CORES.cartao,
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  barraFundo: {
    height: 8,
    backgroundColor: CORES.fundo,
    borderRadius: 4,
    marginTop: 14,
    overflow: 'hidden',
  },
  barraProgresso: {
    height: '100%',
    backgroundColor: CORES.azul,
    borderRadius: 4,
  },
  caixaMetaConcluida: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CORES.verde,
  },

  // Barra de navegação inferior
  barraInferior: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: CORES.cartao,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  botaoNav: {
    alignItems: 'center',
    flex: 1,
  },
  textoNav: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  botaoAdicionar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CORES.azul,
    justifyContent: 'center',
    alignItems: 'center',
    top: -20,
    shadowColor: CORES.azul,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  // Modal
  overlayModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  conteudoModal: {
    backgroundColor: CORES.cartao,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  alcaModal: {
    width: 40,
    height: 4,
    backgroundColor: CORES.borda,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  tituloModal: {
    color: CORES.textoClaro,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Seleção de tipo (Receita / Despesa)
  filhaTipo: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  botaoTipo: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: CORES.fundo,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  textoTipo: {
    color: CORES.textoMedio,
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Grade de categorias
  labelCampo: {
    color: CORES.textoMedio,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 4,
  },
  gradeCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  botaoCategoria: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: CORES.fundo,
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

  // Campo de texto (input)
  input: {
    backgroundColor: CORES.fundo,
    color: CORES.textoClaro,
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
    fontSize: 16,
  },

  // Botões de ação do modal
  botaoCancelar: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: CORES.fundo,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  textoCancelar: {
    color: CORES.textoMedio,
    fontWeight: 'bold',
    fontSize: 15,
  },
  botaoSalvar: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: CORES.azul,
    alignItems: 'center',
  },
  textoSalvar: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
