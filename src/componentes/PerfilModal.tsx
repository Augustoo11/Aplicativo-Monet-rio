// src/componentes/PerfilModal.tsx
// ─────────────────────────────────────────────────────────────
// Modal que aparece ao clicar no avatar do usuário.
// Mostra os dados do perfil e a opção de sair da conta.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { CORES } from '../config';

// Propriedades que esse componente recebe
interface Props {
  visible: boolean;       // se o modal está visível
  onClose: () => void;    // função chamada ao fechar
  nome: string;           // nome do usuário logado
  email: string;          // email do usuário logado
  usuarioId: string | null; // ID do usuário no banco
  onSair: () => void;     // função chamada ao confirmar saída
}

export default function PerfilModal({ visible, onClose, nome, email, usuarioId, onSair }: Props) {

  // Pega as duas primeiras letras do nome para o avatar
  // Ex: "João Silva" → "JS"
  const iniciais = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  // Mostra um alerta antes de sair para confirmar
  function confirmarSaida() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: onSair },
      ]
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* Alça de arraste (decorativa) */}
          <View style={styles.alca} />

          {/* Cabeçalho com título e botão fechar */}
          <View style={styles.cabecalho}>
            <Text style={styles.tituloCabecalho}>Meu Perfil</Text>
            <TouchableOpacity onPress={onClose} style={styles.botaoFechar}>
              <Ionicons name="close" size={22} color={CORES.textoMedio} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Avatar com iniciais + nome e email */}
            <View style={styles.secaoAvatar}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTexto}>{iniciais}</Text>
              </View>
              <Text style={styles.nomeTexto}>{nome}</Text>
              <Text style={styles.emailTexto}>{email}</Text>
            </View>

            {/* Card com informações da conta */}
            <View style={styles.card}>
              <Text style={styles.tituloCard}>INFORMAÇÕES DA CONTA</Text>

              {/* Linha: Nome */}
              <View style={styles.linhaInfo}>
                <View style={styles.iconeInfo}>
                  <FontAwesome5 name="user" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.labelInfo}>Nome completo</Text>
                  <Text style={styles.valorInfo}>{nome}</Text>
                </View>
              </View>

              <View style={styles.divisor} />

              {/* Linha: Email */}
              <View style={styles.linhaInfo}>
                <View style={styles.iconeInfo}>
                  <FontAwesome5 name="envelope" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.labelInfo}>E-mail</Text>
                  <Text style={styles.valorInfo}>{email}</Text>
                </View>
              </View>

              <View style={styles.divisor} />

              {/* Linha: ID do usuário */}
              <View style={styles.linhaInfo}>
                <View style={styles.iconeInfo}>
                  <FontAwesome5 name="id-badge" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.labelInfo}>ID do usuário</Text>
                  <Text style={styles.valorInfo}>#{usuarioId ?? '—'}</Text>
                </View>
              </View>
            </View>

            {/* Seção de Configurações simples */}
            <View style={styles.card}>
              <Text style={styles.tituloCard}>CONFIGURAÇÕES</Text>

              {/* Item: Notificações (visual, sem funcionalidade por enquanto) */}
              <View style={styles.linhaInfo}>
                <View style={styles.iconeInfo}>
                  <FontAwesome5 name="bell" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.valorInfo}>Notificações</Text>
                  <Text style={styles.labelInfo}>Em breve</Text>
                </View>
              </View>

              <View style={styles.divisor} />

              {/* Item: Versão do app */}
              <View style={styles.linhaInfo}>
                <View style={styles.iconeInfo}>
                  <FontAwesome5 name="info-circle" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.valorInfo}>Versão do app</Text>
                  <Text style={styles.labelInfo}>1.0.0</Text>
                </View>
              </View>
            </View>

            {/* Botão de sair */}
            <TouchableOpacity style={styles.botaoSair} onPress={confirmarSaida}>
              <FontAwesome5 name="sign-out-alt" size={16} color={CORES.vermelho} style={{ marginRight: 10 }} />
              <Text style={styles.textoSair}>Sair da conta</Text>
            </TouchableOpacity>

            {/* Espaço extra no final para não ficar colado */}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Fundo escurecido atrás do modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },

  // O painel em si que sobe da parte inferior
  sheet: {
    backgroundColor: CORES.cartao,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    minHeight: '70%',
    borderWidth: 1,
    borderColor: CORES.borda,
  },

  // Alça de arraste no topo do modal
  alca: {
    width: 40,
    height: 4,
    backgroundColor: CORES.borda,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },

  // Cabeçalho com título e botão fechar
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tituloCabecalho: {
    color: CORES.textoClaro,
    fontSize: 20,
    fontWeight: 'bold',
  },
  botaoFechar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CORES.fundo,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Seção do avatar
  secaoAvatar: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CORES.azul,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#60A5FA',
  },
  avatarTexto: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  nomeTexto: {
    color: CORES.textoClaro,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailTexto: {
    color: CORES.textoMedio,
    fontSize: 14,
  },

  // Card de seção (informações e configurações)
  card: {
    backgroundColor: CORES.fundo,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  tituloCard: {
    color: CORES.textoEscuro,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },

  // Linha de informação (ícone + texto)
  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconeInfo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  labelInfo: {
    color: CORES.textoEscuro,
    fontSize: 12,
    marginBottom: 2,
  },
  valorInfo: {
    color: CORES.textoClaro,
    fontSize: 15,
    fontWeight: '500',
  },

  // Linha divisora entre itens
  divisor: {
    height: 1,
    backgroundColor: CORES.cartao,
    marginVertical: 2,
  },

  // Botão de sair
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: CORES.vermelho,
    marginTop: 4,
  },
  textoSair: {
    color: CORES.vermelho,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
