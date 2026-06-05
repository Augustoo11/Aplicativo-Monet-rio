// src/styles/estilosLogin.ts
// ─────────────────────────────────────────────────────────────
// Estilos específicos das telas de Login e Cadastro.
// ─────────────────────────────────────────────────────────────

import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const estilosLogin = StyleSheet.create({

  // Imagem de fundo que cobre a tela inteira
  imagemFundo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Camada escura semitransparente sobre a imagem de fundo
  peliculaEscura: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Área principal que centraliza o conteúdo
  areaPrincipal: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  // Cartão branco/escuro que contém os campos de login
  cartaoLogin: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // Área do ícone/logo no topo do cartão
  iconeTopo: {
    marginBottom: 8,
  },

  // Botão de "Esqueceu a senha?"
  botaoEsqueciSenha: {
    marginTop: 12,
  },
});
