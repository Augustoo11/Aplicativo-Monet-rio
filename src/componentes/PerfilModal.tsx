// src/componentes/PerfilModal.tsx
// ─────────────────────────────────────────────────────────────
// Modal que aparece ao clicar no avatar do usuário.
// Mostra os dados do perfil e a opção de sair da conta.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { CORES } from '../config';
import { estilosPerfilModal } from '../styles/estilosPerfilModal';

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
      <View style={estilosPerfilModal.overlay}>
        <View style={estilosPerfilModal.sheet}>

          {/* Alça de arraste (decorativa) */}
          <View style={estilosPerfilModal.alca} />

          {/* Cabeçalho com título e botão fechar */}
          <View style={estilosPerfilModal.cabecalho}>
            <Text style={estilosPerfilModal.tituloCabecalho}>Meu Perfil</Text>
            <TouchableOpacity onPress={onClose} style={estilosPerfilModal.botaoFechar}>
              <Ionicons name="close" size={22} color={CORES.textoMedio} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Avatar com iniciais + nome e email */}
            <View style={estilosPerfilModal.secaoAvatar}>
              <View style={estilosPerfilModal.avatar}>
                <Text style={estilosPerfilModal.avatarTexto}>{iniciais}</Text>
              </View>
              <Text style={estilosPerfilModal.nomeTexto}>{nome}</Text>
              <Text style={estilosPerfilModal.emailTexto}>{email}</Text>
            </View>

            {/* Card com informações da conta */}
            <View style={estilosPerfilModal.card}>
              <Text style={estilosPerfilModal.tituloCard}>INFORMAÇÕES DA CONTA</Text>

              {/* Linha: Nome */}
              <View style={estilosPerfilModal.linhaInfo}>
                <View style={estilosPerfilModal.iconeInfo}>
                  <FontAwesome5 name="user" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={estilosPerfilModal.labelInfo}>Nome completo</Text>
                  <Text style={estilosPerfilModal.valorInfo}>{nome}</Text>
                </View>
              </View>

              <View style={estilosPerfilModal.divisor} />

              {/* Linha: Email */}
              <View style={estilosPerfilModal.linhaInfo}>
                <View style={estilosPerfilModal.iconeInfo}>
                  <FontAwesome5 name="envelope" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={estilosPerfilModal.labelInfo}>E-mail</Text>
                  <Text style={estilosPerfilModal.valorInfo}>{email}</Text>
                </View>
              </View>

              <View style={estilosPerfilModal.divisor} />

              {/* Linha: ID do usuário */}
              <View style={estilosPerfilModal.linhaInfo}>
                <View style={estilosPerfilModal.iconeInfo}>
                  <FontAwesome5 name="id-badge" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={estilosPerfilModal.labelInfo}>ID do usuário</Text>
                  <Text style={estilosPerfilModal.valorInfo}>#{usuarioId ?? '—'}</Text>
                </View>
              </View>
            </View>

            {/* Seção de Configurações simples */}
            <View style={estilosPerfilModal.card}>
              <Text style={estilosPerfilModal.tituloCard}>CONFIGURAÇÕES</Text>

              {/* Item: Notificações (visual, sem funcionalidade por enquanto) */}
              <View style={estilosPerfilModal.linhaInfo}>
                <View style={estilosPerfilModal.iconeInfo}>
                  <FontAwesome5 name="bell" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={estilosPerfilModal.valorInfo}>Notificações</Text>
                  <Text style={estilosPerfilModal.labelInfo}>Em breve</Text>
                </View>
              </View>

              <View style={estilosPerfilModal.divisor} />

              {/* Item: Versão do app */}
              <View style={estilosPerfilModal.linhaInfo}>
                <View style={estilosPerfilModal.iconeInfo}>
                  <FontAwesome5 name="info-circle" size={14} color={CORES.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={estilosPerfilModal.valorInfo}>Versão do app</Text>
                  <Text style={estilosPerfilModal.labelInfo}>1.0.0</Text>
                </View>
              </View>
            </View>

            {/* Botão de sair */}
            <TouchableOpacity style={estilosPerfilModal.botaoSair} onPress={confirmarSaida}>
              <FontAwesome5 name="sign-out-alt" size={16} color={CORES.vermelho} style={{ marginRight: 10 }} />
              <Text style={estilosPerfilModal.textoSair}>Sair da conta</Text>
            </TouchableOpacity>

            {/* Espaço extra no final para não ficar colado */}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
