import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CORES, API_URL } from '../../src/config';
import { useTransacoesStore } from '../../src/store/src/store/useTransacoesStore';
import { estilosConfiguracoes } from '../../src/styles/estilosConfiguracoes';

export default function Configuracoes() {
  const router = useRouter();
  const { limparTransacoes } = useTransacoesStore();

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  // Resumo rápido de metas
  const [totalMetas, setTotalMetas] = useState(0);
  const [metasConcluidas, setMetasConcluidas] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const nome = await AsyncStorage.getItem('@usuario_nome');
    const email = await AsyncStorage.getItem('@usuario_email');
    const id = await AsyncStorage.getItem('@usuario_id');
    if (nome) setNomeUsuario(nome);
    if (email) setEmailUsuario(email);
    setUsuarioId(id);
    if (id) await buscarResumoMetas(id);
  }

  async function buscarResumoMetas(id: string) {
    try {
      const resposta = await fetch(`${API_URL}/metas/usuario/${id}`);
      if (resposta.ok) {
        const metas = await resposta.json();
        setTotalMetas(metas.length);
        setMetasConcluidas(metas.filter((m: any) => m.status === 'concluida').length);
      }
    } catch {
      // silencia o erro — não é crítico
    }
  }

  // Sai da conta: limpa AsyncStorage e store, volta para login
  async function sairDaConta() {
    Alert.alert('Sair da conta', 'Tem certeza que quer sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['@usuario_id', '@usuario_nome', '@usuario_email']);
          limparTransacoes();
          router.replace('/');
        },
      },
    ]);
  }

  // Iniciais do nome para o avatar
  const iniciais = nomeUsuario
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <SafeAreaView style={estilosConfiguracoes.container}>

      {/* Cabeçalho */}
      <View style={estilosConfiguracoes.cabecalho}>
        <TouchableOpacity onPress={() => router.back()} style={estilosConfiguracoes.botaoVoltar}>
          <Ionicons name="arrow-back" size={24} color={CORES.textoClaro} />
        </TouchableOpacity>
        <Text style={estilosConfiguracoes.titulo}>Configurações</Text>
        <View style={estilosConfiguracoes.espacador} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Card do usuário ── */}
        <View style={estilosConfiguracoes.cardUsuario}>
          <View style={estilosConfiguracoes.avatarGrande}>
            <Text style={estilosConfiguracoes.avatarTexto}>{iniciais}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={estilosConfiguracoes.nomeUsuario}>{nomeUsuario || 'Usuário'}</Text>
            <Text style={estilosConfiguracoes.emailUsuario}>{emailUsuario || '—'}</Text>
          </View>
        </View>

        {/* ── Seção: Metas ── */}
        <Text style={estilosConfiguracoes.tituloSecao}>METAS</Text>

        {/* Card de resumo de metas */}
        <View style={estilosConfiguracoes.cardResumoMetas}>
          <View style={estilosConfiguracoes.resumoMetaItem}>
            <Text style={estilosConfiguracoes.resumoMetaNumero}>{totalMetas}</Text>
            <Text style={estilosConfiguracoes.resumoMetaLabel}>Total</Text>
          </View>
          <View style={estilosConfiguracoes.resumoMetaDivisor} />
          <View style={estilosConfiguracoes.resumoMetaItem}>
            <Text style={[estilosConfiguracoes.resumoMetaNumero, { color: CORES.verde }]}>
              {metasConcluidas}
            </Text>
            <Text style={estilosConfiguracoes.resumoMetaLabel}>Concluídas</Text>
          </View>
          <View style={estilosConfiguracoes.resumoMetaDivisor} />
          <View style={estilosConfiguracoes.resumoMetaItem}>
            <Text style={[estilosConfiguracoes.resumoMetaNumero, { color: '#FACC15' }]}>
              {totalMetas - metasConcluidas}
            </Text>
            <Text style={estilosConfiguracoes.resumoMetaLabel}>Em andamento</Text>
          </View>
        </View>

        {/* Botão: Gerenciar Metas */}
        <TouchableOpacity
          style={estilosConfiguracoes.opcao}
          onPress={() => router.push('/(tabs)/Metas')}
        >
          <View style={estilosConfiguracoes.opcaoEsquerda}>
            <View style={[estilosConfiguracoes.iconeBox, { backgroundColor: '#FACC1520' }]}>
              <Ionicons name="flag" size={20} color="#FACC15" />
            </View>
            <View>
              <Text style={estilosConfiguracoes.opcaoTitulo}>Gerenciar Metas</Text>
              <Text style={estilosConfiguracoes.opcaoDescricao}>Ver, criar e editar suas metas</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={CORES.textoEscuro} />
        </TouchableOpacity>

        {/* ── Seção: Sobre o app ── */}
        <Text style={[estilosConfiguracoes.tituloSecao, { marginTop: 28 }]}>SOBRE O APP</Text>

        {/* Como funciona as metas */}
        <View style={estilosConfiguracoes.caixaInfo}>
          <Text style={estilosConfiguracoes.caixaInfoTitulo}>💡 Como funcionam as metas?</Text>
          <Text style={estilosConfiguracoes.caixaInfoTexto}>
            Ao adicionar uma despesa, escolha{' '}
            <Text style={{ color: '#FACC15', fontWeight: 'bold' }}>🟡 Meta</Text>{' '}
            para vinculá-la a uma meta e acompanhar seu progresso.{'\n\n'}
            Despesas{' '}
            <Text style={{ color: CORES.vermelho, fontWeight: 'bold' }}>🔴 Normais</Text>{' '}
            não afetam nenhuma meta.
          </Text>
        </View>

        {/* Versão do app */}
        <TouchableOpacity style={estilosConfiguracoes.opcao} onPress={() => {}}>
          <View style={estilosConfiguracoes.opcaoEsquerda}>
            <View style={[estilosConfiguracoes.iconeBox, { backgroundColor: '#3B82F620' }]}>
              <Ionicons name="information-circle" size={20} color={CORES.azul} />
            </View>
            <View>
              <Text style={estilosConfiguracoes.opcaoTitulo}>Versão do App</Text>
              <Text style={estilosConfiguracoes.opcaoDescricao}>GestorFin v1.0.0</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Seção: Conta ── */}
        <Text style={[estilosConfiguracoes.tituloSecao, { marginTop: 28 }]}>CONTA</Text>

        {/* Botão: Sair da conta */}
        <TouchableOpacity
          style={[estilosConfiguracoes.opcao, { borderColor: CORES.vermelho + '40' }]}
          onPress={sairDaConta}
        >
          <View style={estilosConfiguracoes.opcaoEsquerda}>
            <View style={[estilosConfiguracoes.iconeBox, { backgroundColor: '#EF444420' }]}>
              <Ionicons name="log-out-outline" size={20} color={CORES.vermelho} />
            </View>
            <View>
              <Text style={[estilosConfiguracoes.opcaoTitulo, { color: CORES.vermelho }]}>
                Sair da conta
              </Text>
              <Text style={estilosConfiguracoes.opcaoDescricao}>Encerrar sessão atual</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={CORES.vermelho} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
