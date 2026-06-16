// app/(tabs)/home.tsx — Tela principal do app

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
import { estilosHome } from '../../src/styles/estilosHome';

type Categoria = { id: string; nome: string; tipo: string };
type MetaSimples = { id: string; nome: string; valorAtual: number; valorAlvo: number };

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
        setTransacoesDoBanco(
          dados.map((t: any) => ({
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
          }))
        );
      }
    } catch {}
  }

  async function buscarCategorias() {
    try {
      const resposta = await fetch(`${API_URL}/categorias`);
      if (resposta.ok) setCategoriasDoBanco(await resposta.json());
    } catch {}
  }

  async function buscarMetasDisponiveis(idDoUsuario: string) {
    try {
      const resposta = await fetch(`${API_URL}/metas/usuario/${idDoUsuario}/status/em_andamento`);
      if (resposta.ok) {
        const dados = await resposta.json();
        setMetasDisponiveis(
          dados.map((m: any) => ({
            id: m.id,
            nome: m.nome,
            valorAtual: m.valorAtual,
            valorAlvo: m.valorAlvo,
          }))
        );
      }
    } catch {}
  }

  async function salvarTransacao() {
    const ehMeta = tipo === 'despesa' && ehDespesaMeta;

    if (!ehMeta && !categoriaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma categoria.');
      return;
    }
    if (!valor) {
      Alert.alert('Atenção', 'Informe o valor.');
      return;
    }
    if (!usuarioId) {
      Alert.alert('Erro', 'Usuário não identificado.');
      return;
    }
    if (ehMeta && !metaSelecionada) {
      Alert.alert('Atenção', 'Selecione qual meta esta despesa vai alimentar.');
      return;
    }

    const valorNumerico = mascaraParaNumero(valor);
    if (valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    setSalvando(true);
    try {
      const hoje = new Date().toISOString().split('T')[0];

      // Quando é despesa de meta, usa a primeira categoria de despesa disponível
      // (o backend exige uma categoria, mas o usuário não precisa escolher)
      const categoriaId = ehMeta
        ? categoriasDoBanco.find((c) => c.tipo === 'despesa')?.id ?? '1'
        : categoriaSelecionada!.id;

      const resposta = await fetch(`${API_URL}/transacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: { id: usuarioId },
          categoria: { id: categoriaId },
          tipo,
          valor: valorNumerico,
          descricao: ehMeta ? `Meta: ${metaSelecionada!.nome}` : (descricao || categoriaSelecionada!.nome),
          data: hoje,
          ehMeta,
          metaId: ehMeta ? metaSelecionada!.id : null,
        }),
      });

      if (resposta.ok || resposta.status === 201) {
        await buscarTransacoes(usuarioId);
        await buscarMetasDisponiveis(usuarioId);
        Alert.alert('Salvo!', 'Transação registrada com sucesso!');
        limparFormulario();
      } else {
        Alert.alert('Erro', await resposta.text());
      }
    } catch {
      Alert.alert('Erro de conexão', 'Verifique se o servidor está rodando.');
    } finally {
      setSalvando(false);
    }
  }

  async function excluirTransacao(idTransacao: string) {
    Alert.alert('Excluir', 'Deseja excluir esta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const resposta = await fetch(`${API_URL}/transacoes/${idTransacao}`, {
              method: 'DELETE',
            });
            if (resposta.ok && usuarioId) {
              await buscarTransacoes(usuarioId);
            } else {
              Alert.alert('Erro', 'Não foi possível excluir a transação.');
            }
          } catch {
            Alert.alert('Erro de conexão', 'Verifique se o servidor está rodando.');
          }
        },
      },
    ]);
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

  function formatarValorInput(texto: string): string {
    const nums = texto.replace(/\D/g, '');
    if (!nums) return '';
    return `R$ ${(parseInt(nums) / 100).toFixed(2).replace('.', ',')}`;
  }

  function mascaraParaNumero(texto: string): number {
    const nums = texto.replace(/\D/g, '');
    if (!nums) return 0;
    return parseInt(nums) / 100;
  }

  function formatarMoeda(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const receitas = totalReceitas();
  const despesas = totalDespesas();
  const saldoAtual = saldo();

  const listaFiltrada = [...transacoes]
    .sort((a, b) => b.data.getTime() - a.data.getTime())
    .filter((item) => filtro === 'todos' || item.tipo === filtro);

  const primeiroNome = nomeUsuario.split(' ')[0];
  const iniciais = nomeUsuario
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
  const mes = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);
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
              <Text style={estilosHome.avatarTexto}>{iniciais}</Text>
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
          <Text style={estilosHome.labelSaldo}>Valor líquido</Text>

          {/* Resumo de metas abaixo do valor líquido */}
          {metasDisponiveis.length > 0 && (
            <View style={estilosHome.resumoMetas}>
              <Ionicons name="flag" size={12} color="#FACC15" style={{ marginRight: 6 }} />
              <Text style={estilosHome.resumoMetasTexto}>
                {metasDisponiveis.length} {metasDisponiveis.length === 1 ? 'meta' : 'metas'} em andamento · acumulado{' '}
                <Text style={{ color: '#FACC15', fontWeight: 'bold' }}>
                  {formatarMoeda(metasDisponiveis.reduce((acc, m) => acc + m.valorAtual, 0))}
                </Text>
              </Text>
            </View>
          )}

          {/* Cartões receita / despesa */}
          <View style={estilosHome.filhaCartoes}>
            <View style={estilosHome.cartao}>
              <View style={estilosHome.cartaoCabecalhoRow}>
                <View style={[estilosHome.bolinha, { backgroundColor: CORES.verde }]} />
                <Text style={estilosHome.labelCartao}>Receitas</Text>
              </View>
              <Text
                style={[estilosHome.valorCartao, { color: CORES.verde }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatarMoeda(receitas)}
              </Text>
            </View>
            <View style={estilosHome.cartao}>
              <View style={estilosHome.cartaoCabecalhoRow}>
                <View style={[estilosHome.bolinha, { backgroundColor: CORES.vermelho }]} />
                <Text style={estilosHome.labelCartao}>Despesas</Text>
              </View>
              <Text
                style={[estilosHome.valorCartao, { color: CORES.vermelho }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatarMoeda(despesas)}
              </Text>
            </View>
          </View>

          {/* Lista de transações */}
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

          {listaFiltrada.slice(0, 20).map((item) => {
            const cor =
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
                    color={cor}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={estilosHome.nomeTransacao}>{item.categoriaLabel}</Text>
                  {item.descricao ? (
                    <Text style={estilosHome.descricaoTransacao}>{item.descricao}</Text>
                  ) : null}
                  <Text style={estilosHome.dataTransacao}>
                    {item.data.toLocaleDateString('pt-BR')}
                  </Text>
                  {item.ehMeta && (
                    <View style={estilosHome.badgeMeta}>
                      <Text style={estilosHome.badgeMetaTexto}>🎯 Meta</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[estilosHome.valorTransacao, { color: cor }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.tipo === 'receita' ? '+' : '-'}{item.valorFormatado}
                </Text>
                <TouchableOpacity
                  style={estilosHome.botaoExcluir}
                  onPress={() => excluirTransacao(item.id)}
                >
                  <Ionicons name="trash-outline" size={16} color={CORES.vermelho} />
                </TouchableOpacity>
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
          <TouchableOpacity
            style={estilosHome.botaoAdicionar}
            onPress={() => setModalTransacao(true)}
          >
            <FontAwesome5 name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={estilosHome.botaoNav}
            onPress={() => router.push('/(tabs)/Metas')}
          >
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
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%' }}
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={estilosHome.conteudoModal}>
                  <View style={estilosHome.alcaModal} />
                  <Text style={estilosHome.tituloModal}>Nova Transação</Text>

                  {/* Tipo: Receita / Despesa */}
                  <View style={estilosHome.filhaTipo}>
                    <TouchableOpacity
                      style={[
                        estilosHome.botaoTipo,
                        tipo === 'receita' && {
                          backgroundColor: CORES.verde,
                          borderColor: CORES.verde,
                        },
                      ]}
                      onPress={() => setTipo('receita')}
                    >
                      <Ionicons
                        name="arrow-up-outline"
                        size={16}
                        color={tipo === 'receita' ? '#fff' : CORES.textoMedio}
                        style={{ marginBottom: 2 }}
                      />
                      <Text
                        style={[
                          estilosHome.textoTipo,
                          tipo === 'receita' && { color: '#fff' },
                        ]}
                      >
                        Receita
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        estilosHome.botaoTipo,
                        tipo === 'despesa' && {
                          backgroundColor: CORES.vermelho,
                          borderColor: CORES.vermelho,
                        },
                      ]}
                      onPress={() => setTipo('despesa')}
                    >
                      <Ionicons
                        name="arrow-down-outline"
                        size={16}
                        color={tipo === 'despesa' ? '#fff' : CORES.textoMedio}
                        style={{ marginBottom: 2 }}
                      />
                      <Text
                        style={[
                          estilosHome.textoTipo,
                          tipo === 'despesa' && { color: '#fff' },
                        ]}
                      >
                        Despesa
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Seção de meta: só para despesas */}
                  {tipo === 'despesa' && (
                    <View style={estilosHome.secaoMeta}>
                      <Text style={estilosHome.labelSecaoMeta}>Tipo de despesa</Text>
                      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                        <TouchableOpacity
                          style={[
                            estilosHome.botaoTipoMeta,
                            !ehDespesaMeta && {
                              backgroundColor: CORES.vermelho + '20',
                              borderColor: CORES.vermelho,
                            },
                          ]}
                          onPress={() => {
                            setEhDespesaMeta(false);
                            setMetaSelecionada(null);
                          }}
                        >
                          <Text style={{ fontSize: 22, marginBottom: 4 }}>🔴</Text>
                          <Text
                            style={[
                              estilosHome.textoTipoMeta,
                              !ehDespesaMeta && {
                                color: CORES.vermelho,
                                fontWeight: 'bold',
                              },
                            ]}
                          >
                            Normal
                          </Text>
                          <Text style={estilosHome.subtextoTipoMeta}>Não afeta metas</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            estilosHome.botaoTipoMeta,
                            ehDespesaMeta && {
                              backgroundColor: '#FACC1520',
                              borderColor: '#FACC15',
                            },
                          ]}
                          onPress={() => setEhDespesaMeta(true)}
                        >
                          <Text style={{ fontSize: 22, marginBottom: 4 }}>🎯</Text>
                          <Text
                            style={[
                              estilosHome.textoTipoMeta,
                              ehDespesaMeta && {
                                color: '#FACC15',
                                fontWeight: 'bold',
                              },
                            ]}
                          >
                            Para meta
                          </Text>
                          <Text style={estilosHome.subtextoTipoMeta}>Avança uma meta</Text>
                        </TouchableOpacity>
                      </View>

                      {ehDespesaMeta && (
                        <>
                          <Text style={estilosHome.labelCampo}>Qual meta?</Text>
                          {metasDisponiveis.length === 0 ? (
                            <View style={estilosHome.avisoSemMeta}>
                              <Ionicons
                                name="flag-outline"
                                size={18}
                                color={CORES.textoEscuro}
                              />
                              <Text style={estilosHome.avisoSemMetaTexto}>
                                Nenhuma meta em andamento.{'\n'}Crie uma meta na aba Metas.
                              </Text>
                            </View>
                          ) : (
                            <View style={{ gap: 8 }}>
                              {metasDisponiveis.map((meta) => {
                                const progresso =
                                  meta.valorAlvo > 0
                                    ? Math.min(
                                        (meta.valorAtual / meta.valorAlvo) * 100,
                                        100
                                      )
                                    : 0;
                                const selecionada = metaSelecionada?.id === meta.id;
                                return (
                                  <TouchableOpacity
                                    key={meta.id}
                                    style={[
                                      estilosHome.botaoMetaOpcao,
                                      selecionada && {
                                        borderColor: '#FACC15',
                                        backgroundColor: '#FACC1510',
                                      },
                                    ]}
                                    onPress={() => setMetaSelecionada(meta)}
                                  >
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 6,
                                      }}
                                    >
                                      <Ionicons
                                        name="flag"
                                        size={14}
                                        color="#FACC15"
                                        style={{ marginRight: 6 }}
                                      />
                                      <Text
                                        style={[
                                          estilosHome.textoMetaOpcao,
                                          selecionada && {
                                            color: '#FACC15',
                                            fontWeight: 'bold',
                                          },
                                        ]}
                                      >
                                        {meta.nome}
                                      </Text>
                                      {selecionada && (
                                        <Ionicons
                                          name="checkmark-circle"
                                          size={16}
                                          color="#FACC15"
                                          style={{ marginLeft: 'auto' }}
                                        />
                                      )}
                                    </View>
                                    <View style={estilosHome.miniBarraFundo}>
                                      <View
                                        style={[
                                          estilosHome.miniBarraProgresso,
                                          { width: `${progresso}%` as any },
                                        ]}
                                      />
                                    </View>
                                    <Text style={estilosHome.miniBarraTexto}>
                                      {progresso.toFixed(0)}% de{' '}
                                      {meta.valorAlvo.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                      })}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  )}

                  {/* Categoria — oculta quando é despesa de meta */}
                  {!(tipo === 'despesa' && ehDespesaMeta) && (
                    <>
                      <Text style={estilosHome.labelCampo}>Categoria</Text>
                      <View style={estilosHome.gradeCategorias}>
                        {categoriasFiltradas.map((cat) => (
                          <TouchableOpacity
                            key={cat.id}
                            style={[
                              estilosHome.botaoCategoria,
                              categoriaSelecionada?.id === cat.id &&
                                estilosHome.botaoCategoriaAtivo,
                            ]}
                            onPress={() => setCategoriaSelecionada(cat)}
                          >
                            <Text
                              style={[
                                estilosHome.textoCategoria,
                                categoriaSelecionada?.id === cat.id &&
                                  estilosHome.textoCategoriaAtivo,
                              ]}
                            >
                              {cat.nome}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  )}

                  {/* Valor */}
                  <Text style={estilosHome.labelCampo}>Valor</Text>
                  <TextInput
                    style={estilosHome.input}
                    placeholder="R$ 0,00"
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                    value={valor}
                    onChangeText={(t) => setValor(formatarValorInput(t))}
                  />

                  {/* Descrição */}
                  <Text style={estilosHome.labelCampo}>Descrição (opcional)</Text>
                  <TextInput
                    style={estilosHome.input}
                    placeholder="Ex: Almoço com amigos"
                    placeholderTextColor="#6b7280"
                    value={descricao}
                    onChangeText={setDescricao}
                  />

                  {/* Botões */}
                  <View style={estilosHome.filhaBotoes}>
                    <TouchableOpacity
                      style={estilosHome.botaoCancelar}
                      onPress={limparFormulario}
                      disabled={salvando}
                    >
                      <Text style={estilosHome.textoCancelar}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[estilosHome.botaoSalvar, salvando && { opacity: 0.7 }]}
                      onPress={salvarTransacao}
                      disabled={salvando}
                    >
                      {salvando ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={estilosHome.textoSalvar}>Salvar</Text>
                      )}
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