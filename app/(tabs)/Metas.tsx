// app/(tabs)/Metas.tsx — Tela de gerenciamento de metas financeiras

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL, CORES } from '../../src/config';
import { estilosMetas } from '../../src/styles/estilosMetas';
import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';

type Meta = {
  id: string;
  nome: string;
  valorAlvo: number;
  valorAtual: number;
  dataLimite: string | null;
  status: string;
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function Metas() {
  const router = useRouter();
  const { setTransacoesDoBanco } = useTransacoesStore();

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [saldoDisponivel, setSaldoDisponivel] = useState(0);

  // Modal: Nova meta
  const [modalNovaMeta, setModalNovaMeta] = useState(false);
  const [nomeMeta, setNomeMeta] = useState('');
  const [valorAlvo, setValorAlvo] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [usarDataLimite, setUsarDataLimite] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(1);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear() + 1);

  // Modal: Contribuição
  const [modalContribuir, setModalContribuir] = useState(false);
  const [metaParaContribuir, setMetaParaContribuir] = useState<Meta | null>(null);
  const [valorContribuicao, setValorContribuicao] = useState('');
  const [contribuindo, setContribuindo] = useState(false);

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    const id = await AsyncStorage.getItem('@usuario_id');
    setUsuarioId(id);
    if (id) {
      await buscarMetas(id);
      await buscarSaldoDisponivel(id);
    }
  }

  async function buscarSaldoDisponivel(idDoUsuario: string) {
    try {
      const resposta = await fetch(`${API_URL}/transacoes/usuario/${idDoUsuario}`);
      if (!resposta.ok) return;

      const transacoes = await resposta.json();

      const totalReceitas = transacoes
        .filter((t: any) => t.tipo === 'receita')
        .reduce((acc: number, t: any) => acc + t.valor, 0);

      const totalDespesas = transacoes
        .filter((t: any) => t.tipo === 'despesa')
        .reduce((acc: number, t: any) => acc + t.valor, 0);

      setSaldoDisponivel(totalReceitas - totalDespesas);
    } catch {}
  }

  async function buscarMetas(idDoUsuario: string) {
    setCarregando(true);
    try {
      const resposta = await fetch(`${API_URL}/metas/usuario/${idDoUsuario}`);
      if (resposta.ok) setMetas(await resposta.json());
    } catch {
      Alert.alert('Erro de conexão', 'Não foi possível buscar as metas.');
    } finally {
      setCarregando(false);
    }
  }

  async function buscarTransacoesStore(idDoUsuario: string) {
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

  function mascaraParaNumero(texto: string): number {
    const limpo = texto.replace(/\D/g, '');
    if (!limpo) return 0;
    return parseInt(limpo) / 100;
  }

  function formatarValorInput(texto: string): string {
    const somenteNumeros = texto.replace(/\D/g, '');
    if (!somenteNumeros) return '';
    const numero = parseInt(somenteNumeros) / 100;
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
  }

  function formatarMoeda(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function montarDataLimite(): string | null {
    if (!usarDataLimite) return null;
    const mes = String(mesSelecionado + 1).padStart(2, '0');
    const dia = String(diaSelecionado).padStart(2, '0');
    return `${anoSelecionado}-${mes}-${dia}`;
  }

  function diasNoMes(mes: number, ano: number): number {
    return new Date(ano, mes + 1, 0).getDate();
  }

  async function salvarMeta() {
    if (!nomeMeta.trim()) {
      Alert.alert('Atenção', 'Digite uma descrição para a meta.');
      return;
    }
    const valorNumerico = mascaraParaNumero(valorAlvo);
    if (valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor objetivo válido.');
      return;
    }
    if (!usuarioId) return;

    setSalvando(true);
    try {
      const novaMeta: any = {
        usuario: { id: usuarioId },
        nome: nomeMeta.trim(),
        valorAlvo: valorNumerico,
        valorAtual: 0,
        status: 'em_andamento',
      };

      const dataLimite = montarDataLimite();
      if (dataLimite) novaMeta.dataLimite = dataLimite;

      const resposta = await fetch(`${API_URL}/metas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaMeta),
      });

      if (resposta.ok) {
        fecharModalNovaMeta();
        await buscarMetas(usuarioId);
        Alert.alert('Sucesso!', 'Meta criada com sucesso!');
      } else {
        const msg = await resposta.text();
        Alert.alert('Erro', msg || 'Não foi possível salvar.');
      }
    } catch {
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setSalvando(false);
    }
  }

  async function contribuirParaMeta() {
    if (!metaParaContribuir) return;

    const valor = mascaraParaNumero(valorContribuicao);
    if (valor <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    if (valor > saldoDisponivel) {
      Alert.alert(
        'Saldo insuficiente',
        `Você tem ${formatarMoeda(saldoDisponivel)} disponível, mas está tentando adicionar ${formatarMoeda(valor)}.`
      );
      return;
    }

    setContribuindo(true);
    try {
      const novoValorAtual = metaParaContribuir.valorAtual + valor;
      const novoStatus =
        novoValorAtual >= metaParaContribuir.valorAlvo ? 'concluida' : 'em_andamento';

      // 1. Atualiza a meta no banco
      const respostaMeta = await fetch(`${API_URL}/metas/${metaParaContribuir.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: metaParaContribuir.nome,
          valorAlvo: metaParaContribuir.valorAlvo,
          valorAtual: novoValorAtual,
          dataLimite: metaParaContribuir.dataLimite,
          status: novoStatus,
        }),
      });

      if (!respostaMeta.ok) {
        Alert.alert('Erro', 'Não foi possível registrar a contribuição.');
        return;
      }

      // 2. Registra a contribuição como transação no histórico
      const hoje = new Date().toISOString().split('T')[0];
      await fetch(`${API_URL}/transacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: { id: usuarioId },
          categoria: { id: '1' }, // categoria padrão para metas
          tipo: 'despesa',
          valor: valor,
          descricao: `Meta: ${metaParaContribuir.nome}`,
          data: hoje,
          ehMeta: true,
          metaId: metaParaContribuir.id,
        }),
      });

      const msg =
        novoStatus === 'concluida'
          ? '🎉 Meta concluída! Parabéns!'
          : 'Contribuição adicionada!';

      fecharModalContribuir();

      if (usuarioId) {
        await buscarMetas(usuarioId);
        await buscarTransacoesStore(usuarioId);
        await buscarSaldoDisponivel(usuarioId);
      }

      Alert.alert('Sucesso!', msg);
    } catch {
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setContribuindo(false);
    }
  }

  async function excluirMeta(meta: Meta) {
    const concluida = meta.status === 'concluida';
    const mensagem = concluida
      ? 'Tem certeza? A meta está concluída. O valor acumulado não será devolvido.'
      : 'Tem certeza? As contribuições desta meta serão removidas e o valor volta ao seu saldo.';

    Alert.alert('Excluir meta', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            // Se a meta não está concluída, apaga as transações vinculadas
            // para que o valor volte ao saldo disponível
            if (!concluida && usuarioId) {
              const respostaTransacoes = await fetch(`${API_URL}/transacoes/usuario/${usuarioId}`);
              if (respostaTransacoes.ok) {
                const todasTransacoes = await respostaTransacoes.json();
                const transacoesDaMeta = todasTransacoes.filter(
                  (t: any) => t.metaId === meta.id || String(t.metaId) === String(meta.id)
                );
                await Promise.all(
                  transacoesDaMeta.map((t: any) =>
                    fetch(`${API_URL}/transacoes/${t.id}`, { method: 'DELETE' })
                  )
                );
              }
            }

            await fetch(`${API_URL}/metas/${meta.id}`, { method: 'DELETE' });

            if (usuarioId) {
              await buscarMetas(usuarioId);
              await buscarSaldoDisponivel(usuarioId);
              await buscarTransacoesStore(usuarioId);
            }
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  }

  function abrirModalContribuir(meta: Meta) {
    setMetaParaContribuir(meta);
    setValorContribuicao('');
    setModalContribuir(true);
  }

  function fecharModalContribuir() {
    setMetaParaContribuir(null);
    setValorContribuicao('');
    setModalContribuir(false);
  }

  function fecharModalNovaMeta() {
    setNomeMeta('');
    setValorAlvo('');
    setUsarDataLimite(false);
    setDiaSelecionado(1);
    setMesSelecionado(new Date().getMonth());
    setAnoSelecionado(new Date().getFullYear() + 1);
    setModalNovaMeta(false);
  }

  const totalMetas = metas.length;
  const metasConcluidas = metas.filter((m) => m.status === 'concluida').length;
  const totalAcumulado = metas.reduce((acc, m) => acc + m.valorAtual, 0);

  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 11 }, (_, i) => anoAtual + i);
  const totalDias = diasNoMes(mesSelecionado, anoSelecionado);
  const dias = Array.from({ length: totalDias }, (_, i) => i + 1);

  return (
    <SafeAreaView style={estilosMetas.container}>

      {/* Cabeçalho */}
      <View style={estilosMetas.cabecalho}>
        <TouchableOpacity onPress={() => router.back()} style={estilosMetas.botaoVoltar}>
          <Ionicons name="arrow-back" size={24} color={CORES.textoClaro} />
        </TouchableOpacity>
        <Text style={estilosMetas.titulo}>Minhas Metas</Text>
        <TouchableOpacity
          style={estilosMetas.botaoNovaMeta}
          onPress={() => setModalNovaMeta(true)}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {carregando && (
        <ActivityIndicator color={CORES.azul} size="large" style={{ marginTop: 40 }} />
      )}

      {!carregando && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* Banner de resumo */}
          {totalMetas > 0 && (
            <View style={estilosMetas.bannerResumo}>
              <View style={estilosMetas.bannerItem}>
                <Text style={estilosMetas.bannerLabel}>METAS</Text>
                <Text style={estilosMetas.bannerValor}>{totalMetas}</Text>
              </View>
              <View style={estilosMetas.bannerDivisor} />
              <View style={estilosMetas.bannerItem}>
                <Text style={estilosMetas.bannerLabel}>CONCLUÍDAS</Text>
                <Text style={[estilosMetas.bannerValor, { color: CORES.verde }]}>
                  {metasConcluidas}
                </Text>
              </View>
              <View style={estilosMetas.bannerDivisor} />
              <View style={estilosMetas.bannerItem}>
                <Text style={estilosMetas.bannerLabel}>ACUMULADO</Text>
                <Text style={[estilosMetas.bannerValor, { color: '#FACC15' }]}>
                  {formatarMoeda(totalAcumulado)}
                </Text>
              </View>
            </View>
          )}

          {/* Estado vazio */}
          {metas.length === 0 && (
            <View style={estilosMetas.caixaVazia}>
              <View style={estilosMetas.iconeVazio}>
                <Ionicons name="flag-outline" size={34} color={CORES.textoEscuro} />
              </View>
              <Text style={estilosMetas.textoVazio}>Nenhuma meta ainda</Text>
              <Text style={estilosMetas.subtextoVazio}>
                Crie metas para guardar dinheiro e acompanhar seu progresso.
              </Text>
              <TouchableOpacity
                style={estilosMetas.botaoPrimeiraMeta}
                onPress={() => setModalNovaMeta(true)}
              >
                <Text style={estilosMetas.botaoPrimeiraMetaTexto}>+ Criar primeira meta</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de metas */}
          {metas.map((meta) => {
            const progresso =
              meta.valorAlvo <= 0
                ? 0
                : Math.min((meta.valorAtual / meta.valorAlvo) * 100, 100);
            const concluida = meta.status === 'concluida';
            const falta = Math.max(meta.valorAlvo - meta.valorAtual, 0);

            return (
              <View style={estilosMetas.cartaoMeta} key={meta.id}>
                <View style={estilosMetas.cartaoCabecalho}>
                  <View style={estilosMetas.iconeMetaBox}>
                    <Ionicons name="flag" size={18} color="#FACC15" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={estilosMetas.nomeMeta}>{meta.nome}</Text>
                    <Text
                      style={[
                        estilosMetas.statusMeta,
                        { color: concluida ? CORES.verde : '#FACC15' },
                      ]}
                    >
                      {concluida ? '✅ Concluída' : '🟡 Em andamento'}
                    </Text>
                  </View>
                  <View style={estilosMetas.acoesCartao}>
                    {!concluida && (
                      <TouchableOpacity
                        style={estilosMetas.botaoContribuir}
                        onPress={() => abrirModalContribuir(meta)}
                      >
                        <Ionicons name="add" size={18} color="#FACC15" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => excluirMeta(meta)}>
                      <Ionicons name="trash-outline" size={20} color={CORES.vermelho} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={estilosMetas.linhaValores}>
                  <Text style={estilosMetas.labelValor}>Objetivo</Text>
                  <Text style={estilosMetas.valorTexto}>{formatarMoeda(meta.valorAlvo)}</Text>
                </View>
                <View style={estilosMetas.linhaValores}>
                  <Text style={estilosMetas.labelValor}>Acumulado</Text>
                  <Text style={[estilosMetas.valorTexto, { color: CORES.verde }]}>
                    {formatarMoeda(meta.valorAtual)}
                  </Text>
                </View>
                {!concluida && (
                  <View style={estilosMetas.linhaValores}>
                    <Text style={estilosMetas.labelValor}>Falta</Text>
                    <Text style={[estilosMetas.valorTexto, { color: '#FACC15' }]}>
                      {formatarMoeda(falta)}
                    </Text>
                  </View>
                )}
                {meta.dataLimite && (
                  <View style={estilosMetas.linhaValores}>
                    <Text style={estilosMetas.labelValor}>Prazo</Text>
                    <Text style={estilosMetas.valorTexto}>
                      {new Date(meta.dataLimite + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                )}

                <View style={estilosMetas.barraFundo}>
                  <View
                    style={[
                      estilosMetas.barraProgresso,
                      {
                        width: `${progresso}%` as any,
                        backgroundColor: concluida ? CORES.verde : '#FACC15',
                      },
                    ]}
                  />
                </View>
                <Text style={estilosMetas.percentual}>{progresso.toFixed(0)}% concluído</Text>

                {concluida && (
                  <View style={estilosMetas.caixaConcluida}>
                    <Text style={{ color: CORES.verde, fontWeight: 'bold', textAlign: 'center' }}>
                      🎉 Parabéns! Você atingiu essa meta!
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Modal: Nova Meta */}
      <Modal visible={modalNovaMeta} transparent animationType="slide">
        <View style={estilosMetas.overlayModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={estilosMetas.conteudoModal}>
                <View style={estilosMetas.alcaModal} />
                <Text style={estilosMetas.tituloModal}>Nova Meta 🎯</Text>

                {/* Descrição da meta (campo obrigatório) */}
                <Text style={estilosMetas.labelCampo}>Descrição da meta *</Text>
                <TextInput
                  style={estilosMetas.input}
                  placeholder="Ex: Viagem, Notebook, Reserva de emergência..."
                  placeholderTextColor="#6b7280"
                  value={nomeMeta}
                  onChangeText={setNomeMeta}
                />

                {/* Valor objetivo */}
                <Text style={estilosMetas.labelCampo}>Valor objetivo</Text>
                <TextInput
                  style={estilosMetas.input}
                  placeholder="R$ 0,00"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  value={valorAlvo}
                  onChangeText={(t) => setValorAlvo(formatarValorInput(t))}
                />

                {/* Data limite */}
                <Text style={estilosMetas.labelCampo}>Data limite</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                  <TouchableOpacity
                    style={[
                      estilosMetas.botaoToggleData,
                      !usarDataLimite && estilosMetas.botaoToggleDataAtivo,
                    ]}
                    onPress={() => setUsarDataLimite(false)}
                  >
                    <Text style={[estilosMetas.textoToggleData, !usarDataLimite && { color: '#fff' }]}>
                      Sem prazo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      estilosMetas.botaoToggleData,
                      usarDataLimite && estilosMetas.botaoToggleDataAtivo,
                    ]}
                    onPress={() => setUsarDataLimite(true)}
                  >
                    <Text style={[estilosMetas.textoToggleData, usarDataLimite && { color: '#fff' }]}>
                      Com prazo
                    </Text>
                  </TouchableOpacity>
                </View>

                {usarDataLimite && (
                  <View style={estilosMetas.caixaData}>
                    <Text style={estilosMetas.labelDataPequeno}>
                      📅 {String(diaSelecionado).padStart(2, '0')}/
                      {String(mesSelecionado + 1).padStart(2, '0')}/{anoSelecionado}
                    </Text>

                    <Text style={estilosMetas.labelSeletor}>Mês</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                      {MESES.map((mes, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            estilosMetas.chipData,
                            mesSelecionado === idx && estilosMetas.chipDataAtivo,
                          ]}
                          onPress={() => {
                            setMesSelecionado(idx);
                            const max = diasNoMes(idx, anoSelecionado);
                            if (diaSelecionado > max) setDiaSelecionado(max);
                          }}
                        >
                          <Text
                            style={[
                              estilosMetas.textoChipData,
                              mesSelecionado === idx && { color: '#000', fontWeight: 'bold' },
                            ]}
                          >
                            {mes.slice(0, 3)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <Text style={estilosMetas.labelSeletor}>Dia</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                      {dias.map((d) => (
                        <TouchableOpacity
                          key={d}
                          style={[
                            estilosMetas.chipDataPequeno,
                            diaSelecionado === d && estilosMetas.chipDataAtivo,
                          ]}
                          onPress={() => setDiaSelecionado(d)}
                        >
                          <Text
                            style={[
                              estilosMetas.textoChipData,
                              diaSelecionado === d && { color: '#000', fontWeight: 'bold' },
                            ]}
                          >
                            {String(d).padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <Text style={estilosMetas.labelSeletor}>Ano</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
                      {anos.map((a) => (
                        <TouchableOpacity
                          key={a}
                          style={[
                            estilosMetas.chipData,
                            anoSelecionado === a && estilosMetas.chipDataAtivo,
                          ]}
                          onPress={() => {
                            setAnoSelecionado(a);
                            const max = diasNoMes(mesSelecionado, a);
                            if (diaSelecionado > max) setDiaSelecionado(max);
                          }}
                        >
                          <Text
                            style={[
                              estilosMetas.textoChipData,
                              anoSelecionado === a && { color: '#000', fontWeight: 'bold' },
                            ]}
                          >
                            {a}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={estilosMetas.filhaBotoes}>
                  <TouchableOpacity
                    style={estilosMetas.botaoCancelar}
                    onPress={fecharModalNovaMeta}
                    disabled={salvando}
                  >
                    <Text style={estilosMetas.textoCancelar}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[estilosMetas.botaoSalvar, salvando && { opacity: 0.6 }]}
                    onPress={salvarMeta}
                    disabled={salvando}
                  >
                    {salvando ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={estilosMetas.textoSalvar}>Criar Meta</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Modal: Contribuição */}
      <Modal visible={modalContribuir} transparent animationType="slide">
        <View style={estilosMetas.overlayModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <View style={estilosMetas.conteudoModal}>
              <View style={estilosMetas.alcaModal} />
              <Text style={estilosMetas.tituloModal}>Adicionar Valor 💰</Text>

              {metaParaContribuir && (
                <View style={estilosMetas.caixaInfoMeta}>
                  <Text style={estilosMetas.nomeInfoMeta}>{metaParaContribuir.nome}</Text>
                  <View style={estilosMetas.barraFundo}>
                    <View
                      style={[
                        estilosMetas.barraProgresso,
                        {
                          width: `${Math.min(
                            (metaParaContribuir.valorAtual / metaParaContribuir.valorAlvo) * 100,
                            100
                          )}%` as any,
                          backgroundColor: '#FACC15',
                        },
                      ]}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text style={{ color: CORES.verde, fontSize: 13, fontWeight: 'bold' }}>
                      {formatarMoeda(metaParaContribuir.valorAtual)} acumulado
                    </Text>
                    <Text style={{ color: CORES.textoEscuro, fontSize: 13 }}>
                      de {formatarMoeda(metaParaContribuir.valorAlvo)}
                    </Text>
                  </View>
                </View>
              )}

              <Text style={estilosMetas.labelCampo}>Quanto você quer adicionar?</Text>
              <Text style={[estilosMetas.labelCampo, { marginTop: -6, marginBottom: 12 }]}>
                Saldo disponível:{' '}
                <Text style={{ color: saldoDisponivel > 0 ? CORES.verde : CORES.vermelho, fontWeight: 'bold' }}>
                  {formatarMoeda(saldoDisponivel)}
                </Text>
              </Text>

              <TextInput
                style={estilosMetas.input}
                placeholder="R$ 0,00"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                value={valorContribuicao}
                onChangeText={(t) => setValorContribuicao(formatarValorInput(t))}
                autoFocus
              />

              <View style={estilosMetas.filhaBotoes}>
                <TouchableOpacity
                  style={estilosMetas.botaoCancelar}
                  onPress={fecharModalContribuir}
                  disabled={contribuindo}
                >
                  <Text style={estilosMetas.textoCancelar}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[estilosMetas.botaoSalvarAmarelo, contribuindo && { opacity: 0.6 }]}
                  onPress={contribuirParaMeta}
                  disabled={contribuindo}
                >
                  {contribuindo ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={estilosMetas.textoSalvarAmarelo}>Confirmar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}