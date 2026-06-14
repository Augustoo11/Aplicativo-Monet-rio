// src/styles/estilosPerfilModal.ts
// ─────────────────────────────────────────────────────────────
// Estilos do componente src/componentes/PerfilModal.tsx
// Separado do componente para deixar o código mais organizado.
// ─────────────────────────────────────────────────────────────

import { StyleSheet } from 'react-native';
import { CORES } from '../config';

export const estilosPerfilModal = StyleSheet.create({
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
