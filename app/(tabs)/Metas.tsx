// app/(tabs)/Metas.tsx
// Tela de Metas — estilos separados em estilosMetas.ts
// ✅ UX melhorada: banner de resumo, cards mais ricos
// ✅ NOVO: botão "Contribuir" dentro de cada meta
// ✅ NOVO: despesas de meta reduzem o valor líquido (via store)

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
import { estilosMetas } from './estilosMetas';

// Tipo de uma meta vinda do banco
type Meta = {
  id: number;
  nome: string;
  valorAlvo: number;
  valorAtual: number;
  dataLimite: string | null;
  status: string;
};

export default function Metas() {
  const router = useRouter();

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Modal de criar nova meta
  const [modalNovaMeta, setModalNovaMeta] = useState(false);
  const [nomeMeta, setNomeMeta] = useState('');
  const [valorAlvo, setValorAlvo] = useState('');
  const [dataLimite, setDataLimite] = useState('');
  const [salvando, setSalvando] = useState(false);

  // ✅ NOVO: Modal de contribuição (adicionar valor a uma meta existente)
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
    if (id) await buscarMetas(id);
  }

  // ─── Busca metas do banco ──────────────────────────────────
  async function buscarMetas(idDoUsuario: string) {
    setCarregando(true);
    try {
      const resposta = await fetch(`${API_URL}/metas/usuario/${idDoUsuario}`);
      if (resposta.ok) {
        const dados = await resposta.json();
        setMetas(dados);
      }
    } catch {
      Alert.alert('Erro de conexão', 'Não foi possível buscar as metas.');
    } finally {
      setCarregando(false);
    }
  }

  // ─── Salva nova meta no banco ──────────────────────────────
  async function salvarMeta() {
    if (!nomeMeta.trim()) {
      Alert.alert('Atenção', 'Digite o nome da meta.');
      return;
    }
    const valorNumerico = parseFloat(valorAlvo.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor alvo válido.');
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
      if (dataLimite.trim()) novaMeta.dataLimite = dataLimite.trim();

      const resposta = await fetch(`${API_URL}/metas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaMeta),
      });

      if (resposta.ok) {
        Alert.alert('Sucesso!', 'Meta criada com sucesso!');
        fecharModalNovaMeta();
        await buscarMetas(usuarioId);
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

  // ✅ NOVO: Contribuir com um valor para uma meta
  // Isso atualiza diretamente o valorAtual da meta no banco via PUT
  async function contribuirParaMeta() {
    if (!metaParaContribuir) return;

    const valor = parseFloat(valorContribuicao.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    setContribuindo(true);
    try {
      // Calcula o novo valor acumulado
      const novoValorAtual = metaParaContribuir.valorAtual + valor;
      const novoStatus = novoValorAtual >= metaParaContribuir.valorAlvo
        ? 'concluida'
        : 'em_andamento';

      // Atualiza a meta via PUT
      const resposta = await fetch(`${API_URL}/metas/${metaParaContribuir.id}`, {
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

      if (resposta.ok) {
        const msg = novoStatus === 'concluida'
          ? '🎉 Meta concluída! Parabéns!'
          : 'Contribuição adicionada!';
        Alert.alert('Sucesso!', msg);
        fecharModalContribuir();
        if (usuarioId) await buscarMetas(usuarioId);
      } else {
        Alert.alert('Erro', 'Não foi possível registrar a contribuição.');
      }
    } catch {
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setContribuindo(false);
    }
  }

  // ─── Exclui uma meta ───────────────────────────────────────
  async function excluirMeta(id: number) {
    Alert.alert('Excluir meta', 'Tem certeza que quer excluir esta meta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`${API_URL}/metas/${id}`, { method: 'DELETE' });
            if (usuarioId) await buscarMetas(usuarioId);
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
    setDataLimite('');
    setModalNovaMeta(false);
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ─── Dados do banner de resumo ─────────────────────────────
  const totalMetas = metas.length;
  const metasConcluidas = metas.filter((m) => m.status === 'concluida').length;
  const totalAcumulado = metas.reduce((acc, m) => acc + m.valorAtual, 0);

  // ─── Renderização ─────────────────────────────────────────
  return (
    <SafeAreaView style={estilosMetas.container}>

      {/* Cabeçalho */}
      <View style={estilosMetas.cabecalho}>
        <TouchableOpacity onPress={() => router.back()} style={estilosMetas.botaoVoltar}>
          <Ionicons name="arrow-back" size={24} color={CORES.textoClaro} />
        </TouchableOpacity>
        <Text style={estilosMetas.titulo}>Metas</Text>
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

          {/* ✅ NOVO: Banner de resumo — aparece sempre que há metas */}
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
                <Text style={estilosMetas.botaoPrimeiraMetaTexto}>Criar primeira meta</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de metas */}
          {metas.map((meta) => {
            const progresso =
              meta.valorAlvo <= 0 ? 0 : Math.min((meta.valorAtual / meta.valorAlvo) * 100, 100);
            const concluida = meta.status === 'concluida';
            const falta = Math.max(meta.valorAlvo - meta.valorAtual, 0);
            const corStatus = concluida ? CORES.verde : '#FACC15';
            const textoStatus = concluida ? '✅ Concluída' : '🟡 Em andamento';

            return (
              <View style={estilosMetas.cartaoMeta} key={meta.id}>

                {/* Cabeçalho do cartão */}
                <View style={estilosMetas.cartaoCabecalho}>
                  <View style={estilosMetas.iconeMetaBox}>
                    <Ionicons name="flag" size={18} color="#FACC15" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={estilosMetas.nomeMeta}>{meta.nome}</Text>
                    <Text style={[estilosMetas.statusMeta, { color: corStatus }]}>
                      {textoStatus}
                    </Text>
                  </View>
                  {/* Ações: Contribuir + Excluir */}
                  <View style={estilosMetas.acoesCartao}>
                    {/* ✅ NOVO: botão Contribuir — só aparece se não estiver concluída */}
                    {!concluida && (
                      <TouchableOpacity
                        style={estilosMetas.botaoContribuir}
                        onPress={() => abrirModalContribuir(meta)}
                      >
                        <Ionicons name="add" size={18} color="#FACC15" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => excluirMeta(meta.id)}>
                      <Ionicons name="trash-outline" size={20} color={CORES.vermelho} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Valores */}
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

                {/* Barra de progresso */}
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

                {/* Mensagem de parabéns */}
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

      {/* ── Modal: Nova Meta ── */}
      <Modal visible={modalNovaMeta} transparent animationType="slide">
        <View style={estilosMetas.overlayModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <View style={estilosMetas.conteudoModal}>
              <View style={estilosMetas.alcaModal} />
              <Text style={estilosMetas.tituloModal}>Nova Meta</Text>
              <Text style={estilosMetas.subtituloModal}>
                Defina um objetivo e acompanhe seu progresso.
              </Text>

              <Text style={estilosMetas.labelCampo}>Nome da meta</Text>
              <TextInput
                style={estilosMetas.input}
                placeholder="Ex: Viagem, Notebook, Reserva..."
                placeholderTextColor="#6b7280"
                value={nomeMeta}
                onChangeText={setNomeMeta}
              />

              <Text style={estilosMetas.labelCampo}>Valor objetivo (R$)</Text>
              <TextInput
                style={estilosMetas.input}
                placeholder="Ex: 5000"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                value={valorAlvo}
                onChangeText={setValorAlvo}
              />

              <Text style={estilosMetas.labelCampo}>Data limite (opcional, formato: AAAA-MM-DD)</Text>
              <TextInput
                style={estilosMetas.input}
                placeholder="Ex: 2026-12-31"
                placeholderTextColor="#6b7280"
                value={dataLimite}
                onChangeText={setDataLimite}
              />

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
                  {salvando
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={estilosMetas.textoSalvar}>Salvar Meta</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ✅ NOVO: Modal de Contribuição */}
      <Modal visible={modalContribuir} transparent animationType="slide">
        <View style={estilosMetas.overlayModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <View style={estilosMetas.conteudoModal}>
              <View style={estilosMetas.alcaModal} />
              <Text style={estilosMetas.tituloModal}>Adicionar Contribuição</Text>
              <Text style={estilosMetas.subtituloModal}>
                {metaParaContribuir?.nome ?? ''}{'\n'}
                Acumulado: {formatarMoeda(metaParaContribuir?.valorAtual ?? 0)} de{' '}
                {formatarMoeda(metaParaContribuir?.valorAlvo ?? 0)}
              </Text>

              <Text style={estilosMetas.labelCampo}>Valor a adicionar (R$)</Text>
              <TextInput
                style={estilosMetas.input}
                placeholder="Ex: 200"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                value={valorContribuicao}
                onChangeText={setValorContribuicao}
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
                  {contribuindo
                    ? <ActivityIndicator color="#000" />
                    : <Text style={estilosMetas.textoSalvarAmarelo}>Confirmar</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
