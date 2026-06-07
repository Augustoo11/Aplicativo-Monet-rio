// app/(tabs)/home.tsx
// Tela principal — estilos separados em estilosHome.ts
// ✅ Despesas de meta SÃO descontadas do saldo (via store)
// ✅ Ícone de engrenagem → Configurações

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
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
import { API_URL, CORES } from '../../src/config';
import { estilosHome } from './estilosHome';

type Categoria = {
  id: number;
  nome: string;
  tipo: string;
};

type MetaSimples = {
  id: number;
  nome: string;
};

export default function Home() {
  const { totalReceitas, totalDespesas, saldo, transacoes, setTransacoesDoBanco } =
    useTransacoesStore();

  const router = useRouter();

  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const [modalTransacao, setModalTransacao] = useState(false);
  const [modalPerfil, setModalPerfil] = useState(false);

  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [ehDespesaMeta, setEhDespesaMeta] = useState(false);
  const [metaSelecionada, setMetaSelecionada] = useState<MetaSimples | null>(null);
  const [metasDisponiveis, setMetasDisponiveis] = useState<MetaSimples[]>([]);

  const [categoriasDoBanco, setCategoriasDoBanco] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'receita' | 'despesa'>('todos');

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    setCategoriaSelecionada(null);
    setEhDespesaMeta(false);
    setMetaSelecionada(null);
  }, [tipo]);

  async function carregarDadosIniciais() {
    const nome = await AsyncStorage.getItem('@usuario_nome');
    const email = await AsyncStorage.getItem('@usuario_email');
    const id = await AsyncStorage.getItem('@usuario_id');
    if (nome) setNomeUsuario(nome);
    if (email) setEmailUsuario(email);
    setUsuarioId(id);
    await buscarCategorias();
    if (id) {
      await buscarTransacoes(id);
      await buscarMetasDisponiveis(id);
    }
  }

  async function buscarTransacoes(idDoUsuario: string) {
    try {
      const resposta = await fetch(`${API_URL}/transacoes/usuario/${idDoUsuario}`);
      if (resposta.ok) {
        const dados = await resposta.json();
        const formatadas = dados.map((t: any) => ({
          id: String(t.id),
          tipo: t.tipo,
          valor: t.valor,
          valorFormatado: formatarMoeda(t.valor),
          categoriaId: String(t.categoria.id),
          categoriaLabel: t.categoria.nome,
          descricao: t.descricao,
          data: new Date(t.data + 'T00:00:00'),
          ehMeta: t.ehMeta || false,
          metaId: t.metaId || null,
        }));
        setTransacoesDoBanco(formatadas);
      }
    } catch (erro) {
      console.log('Erro ao buscar transações:', erro);
    }
  }

  async function buscarCategorias() {
    try {
      const resposta = await fetch(`${API_URL}/categorias`);
      if (resposta.ok) setCategoriasDoBanco(await resposta.json());
    } catch (erro) {
      console.log('Erro ao buscar categorias:', erro);
    }
  }

  async function buscarMetasDisponiveis(idDoUsuario: string) {
    try {
      const resposta = await fetch(
        `${API_URL}/metas/usuario/${idDoUsuario}/status/em_andamento`
      );
      if (resposta.ok) {
        const dados = await resposta.json();
        setMetasDisponiveis(dados.map((m: any) => ({ id: m.id, nome: m.nome })));
      }
    } catch (erro) {
      console.log('Erro ao buscar metas:', erro);
    }
  }

  async function salvarTransacao() {
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
    if (tipo === 'despesa' && ehDespesaMeta && !metaSelecionada) {
      Alert.alert('Atenção', 'Selecione a meta que esta despesa vai afetar.');
      return;
    }

    const valorNumerico = textoParaNumero(valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    setSalvando(true);
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const novaTransacao: any = {
        usuario: { id: usuarioId },
        categoria: { id: categoriaSelecionada.id },
        tipo,
        valor: valorNumerico,
        descricao: descricao || categoriaSelecionada.nome,
        data: hoje,
        ehMeta: tipo === 'despesa' ? ehDespesaMeta : false,
        metaId: tipo === 'despesa' && ehDespesaMeta ? metaSelecionada?.id : null,
      };

      const resposta = await fetch(`${API_URL}/transacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTransacao),
      });

      if (resposta.ok || resposta.status === 201) {
        await buscarTransacoes(usuarioId);
        if (usuarioId) await buscarMetasDisponiveis(usuarioId);
        Alert.alert('Salvo!', 'Transação registrada com sucesso!');
        limparFormulario();
      } else {
        const mensagem = await resposta.text();
        Alert.alert('Erro', mensagem || 'Não foi possível salvar.');
      }
    } catch {
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setSalvando(false);
    }
  }

  async function sairDaConta() {
    await AsyncStorage.multiRemove(['@usuario_id', '@usuario_nome', '@usuario_email']);
    setModalPerfil(false);
    router.replace('/');
  }

  function limparFormulario() {
    setValor('');
    setDescricao('');
    setCategoriaSelecionada(null);
    setTipo('despesa');
    setEhDespesaMeta(false);
    setMetaSelecionada(null);
    setModalTransacao(false);
  }

  function formatarValorInput(texto: string) {
    const somenteNumeros = texto.replace(/\D/g, '');
    if (!somenteNumeros) return '';
    const numero = parseInt(somenteNumeros) / 100;
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
  }

  function textoParaNumero(texto: string): number {
    return parseFloat(texto.replace('R$ ', '').replace(',', '.') || '0');
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ✅ totalDespesas() no store já inclui despesas de meta (ver useTransacoesStore)
  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();

  const listaOrdenada = [...transacoes].sort((a, b) => b.data.getTime() - a.data.getTime());
  const listaFiltrada = listaOrdenada.filter((item) => {
    if (filtro === 'todos') return true;
    return item.tipo === filtro;
  });

  const primeiroNome = nomeUsuario.split(' ')[0];
  const iniciaisUsuario = nomeUsuario
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
  const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const mesFormatado = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);
  const categoriasFiltradas = categoriasDoBanco.filter((c) => c.tipo === tipo);

  return (
    <SafeAreaView style={estilosHome.container}>
      <View style={estilosHome.conteudo}>

        {/* Cabeçalho */}
        <View style={estilosHome.cabecalho}>
          <View style={estilosHome.logoRow}>
            <View style={estilosHome.logoBox}>
              <Image
                source={require('../../src/assets/logo.png')}
                style={estilosHome.logoImagem}
                resizeMode="contain"
              />
            </View>
            <Text style={estilosHome.logoTexto}>GestorFin</Text>
          </View>

          <View style={estilosHome.cabecalhoDireita}>
            <TouchableOpacity
              style={estilosHome.botaoEngrenagem}
              onPress={() => router.push('/(tabs)/Configuracoes')}
            >
              <Ionicons name="settings-outline" size={20} color={CORES.textoMedio} />
            </TouchableOpacity>
            <TouchableOpacity style={estilosHome.avatar} onPress={() => setModalPerfil(true)}>
              <Text style={estilosHome.avatarTexto}>{iniciaisUsuario}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

          <Text style={estilosHome.saudacao}>Olá, {primeiroNome} · {mesFormatado}</Text>

          <Text
            style={[estilosHome.saldo, { color: saldoAtual >= 0 ? CORES.verde : CORES.vermelho }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatarMoeda(saldoAtual)}
          </Text>
          <Text style={estilosHome.labelSaldo}>saldo do mês</Text>

          {/* Cartões receita / despesa */}
          <View style={estilosHome.filhaCartoes}>
            <View style={estilosHome.cartao}>
              <View style={estilosHome.cartaoCabecalhoRow}>
                <View style={[estilosHome.bolinha, { backgroundColor: CORES.verde }]} />
                <Text style={estilosHome.labelCartao}>Receitas</Text>
              </View>
              <Text style={[estilosHome.valorCartao, { color: CORES.verde }]} numberOfLines={1} adjustsFontSizeToFit>
                {formatarMoeda(receitas)}
              </Text>
            </View>

            <View style={estilosHome.cartao}>
              <View style={estilosHome.cartaoCabecalhoRow}>
                <View style={[estilosHome.bolinha, { backgroundColor: CORES.vermelho }]} />
                <Text style={estilosHome.labelCartao}>Despesas</Text>
              </View>
              <Text style={[estilosHome.valorCartao, { color: CORES.vermelho }]} numberOfLines={1} adjustsFontSizeToFit>
                {formatarMoeda(despesas)}
              </Text>
            </View>
          </View>

          <Text style={estilosHome.tituloSecao}>TRANSAÇÕES</Text>

          <View style={estilosHome.areaFiltro}>
            {(['todos', 'receita', 'despesa'] as const).map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={[estilosHome.botaoFiltro, filtro === opcao && estilosHome.botaoFiltroAtivo]}
                onPress={() => setFiltro(opcao)}
              >
                <Text style={[estilosHome.textoFiltro, filtro === opcao && estilosHome.textoFiltroAtivo]}>
                  {opcao === 'todos' ? 'Todos' : opcao === 'receita' ? 'Receitas' : 'Despesas'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {listaFiltrada.length === 0 && (
            <Text style={estilosHome.textoVazio}>Nenhuma transação encontrada.</Text>
          )}

          {listaFiltrada.slice(0, 10).map((item) => {
            const corItem =
              item.tipo === 'receita' ? CORES.verde : item.ehMeta ? '#FACC15' : CORES.vermelho;

            return (
              <View style={estilosHome.itemTransacao} key={item.id}>
                <View style={estilosHome.iconeTransacao}>
                  <Ionicons
                    name={
                      item.tipo === 'receita'
                        ? 'wallet-outline'
                        : item.ehMeta
                        ? 'flag-outline'
                        : 'arrow-down-outline'
                    }
                    size={20}
                    color={corItem}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={estilosHome.nomeTransacao}>{item.categoriaLabel}</Text>
                  <Text style={estilosHome.dataTransacao}>{item.data.toLocaleDateString('pt-BR')}</Text>
                  {item.ehMeta && (
                    <View style={estilosHome.badgeMeta}>
                      <Text style={estilosHome.badgeMetaTexto}>🎯 Meta</Text>
                    </View>
                  )}
                </View>
                <Text style={[estilosHome.valorTransacao, { color: corItem }]} numberOfLines={1} adjustsFontSizeToFit>
                  {item.tipo === 'receita' ? '+' : '-'}{item.valorFormatado}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Barra inferior */}
        <View style={estilosHome.barraInferior}>
          <TouchableOpacity style={estilosHome.botaoNav} onPress={() => {}}>
            <FontAwesome5 name="th-large" size={20} color={CORES.azul} />
            <Text style={[estilosHome.textoNav, { color: CORES.azul }]}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilosHome.botaoAdicionar} onPress={() => setModalTransacao(true)}>
            <FontAwesome5 name="plus" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={estilosHome.botaoNav} onPress={() => router.push('/(tabs)/Metas')}>
            <Ionicons name="flag-outline" size={22} color={CORES.textoEscuro} />
            <Text style={[estilosHome.textoNav, { color: CORES.textoEscuro }]}>Metas</Text>
          </TouchableOpacity>
        </View>

        <PerfilModal
          visible={modalPerfil}
          onClose={() => setModalPerfil(false)}
          nome={nomeUsuario}
          email={emailUsuario}
          usuarioId={usuarioId}
          onSair={sairDaConta}
        />

        {/* Modal: Nova Transação */}
        <Modal visible={modalTransacao} transparent animationType="slide">
          <View style={estilosHome.overlayModal}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={estilosHome.conteudoModal}>
                  <View style={estilosHome.alcaModal} />
                  <Text style={estilosHome.tituloModal}>Nova Transação</Text>

                  {/* Tipo */}
                  <View style={estilosHome.filhaTipo}>
                    <TouchableOpacity
                      style={[estilosHome.botaoTipo, tipo === 'receita' && { backgroundColor: CORES.verde, borderColor: CORES.verde }]}
                      onPress={() => setTipo('receita')}
                    >
                      <Text style={[estilosHome.textoTipo, tipo === 'receita' && { color: '#fff' }]}>Receita</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[estilosHome.botaoTipo, tipo === 'despesa' && { backgroundColor: CORES.vermelho, borderColor: CORES.vermelho }]}
                      onPress={() => setTipo('despesa')}
                    >
                      <Text style={[estilosHome.textoTipo, tipo === 'despesa' && { color: '#fff' }]}>Despesa</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Seção de meta — só para despesas */}
                  {tipo === 'despesa' && (
                    <View style={estilosHome.secaoMeta}>
                      <Text style={estilosHome.labelCampo}>Essa despesa é para uma meta?</Text>
                      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                        <TouchableOpacity
                          style={[estilosHome.botaoToggle, !ehDespesaMeta && { backgroundColor: CORES.vermelho, borderColor: CORES.vermelho }]}
                          onPress={() => { setEhDespesaMeta(false); setMetaSelecionada(null); }}
                        >
                          <Text style={[estilosHome.textoToggle, !ehDespesaMeta && { color: '#fff' }]}>
                            🔴 Normal
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[estilosHome.botaoToggle, ehDespesaMeta && { backgroundColor: '#FACC15', borderColor: '#FACC15' }]}
                          onPress={() => setEhDespesaMeta(true)}
                        >
                          <Text style={[estilosHome.textoToggle, ehDespesaMeta && { color: '#000' }]}>
                            🟡 Meta
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {ehDespesaMeta && (
                        <>
                          <Text style={estilosHome.labelCampo}>Selecione a meta</Text>
                          {metasDisponiveis.length === 0 ? (
                            <Text style={{ color: CORES.textoEscuro, fontSize: 13, marginBottom: 14 }}>
                              Nenhuma meta em andamento. Crie uma meta primeiro.
                            </Text>
                          ) : (
                            <View style={estilosHome.gradeCategorias}>
                              {metasDisponiveis.map((meta) => (
                                <TouchableOpacity
                                  key={meta.id}
                                  style={[
                                    estilosHome.botaoCategoria,
                                    metaSelecionada?.id === meta.id && { backgroundColor: '#FACC15', borderColor: '#FACC15' },
                                  ]}
                                  onPress={() => setMetaSelecionada(meta)}
                                >
                                  <Text style={[
                                    estilosHome.textoCategoria,
                                    metaSelecionada?.id === meta.id && { color: '#000', fontWeight: 'bold' },
                                  ]}>
                                    {meta.nome}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  )}

                  {/* Categorias */}
                  <Text style={estilosHome.labelCampo}>Categoria</Text>
                  <View style={estilosHome.gradeCategorias}>
                    {categoriasFiltradas.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[estilosHome.botaoCategoria, categoriaSelecionada?.id === cat.id && estilosHome.botaoCategoriaAtivo]}
                        onPress={() => setCategoriaSelecionada(cat)}
                      >
                        <Text style={[estilosHome.textoCategoria, categoriaSelecionada?.id === cat.id && estilosHome.textoCategoriaAtivo]}>
                          {cat.nome}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={estilosHome.labelCampo}>Valor</Text>
                  <TextInput
                    style={estilosHome.input}
                    placeholder="R$ 0,00"
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                    value={valor}
                    onChangeText={(t) => setValor(formatarValorInput(t))}
                  />

                  <Text style={estilosHome.labelCampo}>Descrição (opcional)</Text>
                  <TextInput
                    style={estilosHome.input}
                    placeholder="Ex: Almoço com amigos"
                    placeholderTextColor="#6b7280"
                    value={descricao}
                    onChangeText={setDescricao}
                  />

                  <View style={estilosHome.filhaBotoes}>
                    <TouchableOpacity style={estilosHome.botaoCancelar} onPress={limparFormulario} disabled={salvando}>
                      <Text style={estilosHome.textoCancelar}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[estilosHome.botaoSalvar, salvando && { opacity: 0.7 }]}
                      onPress={salvarTransacao}
                      disabled={salvando}
                    >
                      {salvando ? <ActivityIndicator color="#fff" /> : <Text style={estilosHome.textoSalvar}>Salvar</Text>}
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
