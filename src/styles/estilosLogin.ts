// src/styles/estilosLogin.ts
// Estilos específicos das telas de Login e Cadastro.

import { StyleSheet } from 'react-native';

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

  // Cartão que contém os campos de login
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

  // ✅ CORRIGIDO: área do logo no topo — tamanho restaurado
  iconeTopo: {
    marginBottom: 12,
    alignItems: 'center',
  },

  // ✅ CORRIGIDO: tamanho da logo restaurado para o original
  logo: {
    width: 160,
    height: 160,
  },

  // Botão de "Esqueceu a senha?"
  botaoEsqueciSenha: {
    marginTop: 12,
  },

  // ✅ MOVIDO de app/cadastro.tsx — estilos específicos da tela de cadastro

  // ScrollView centraliza o conteúdo verticalmente
  scrollCadastro: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },

  // Ajuste extra no cartão para tela de cadastro
  cartaoAjustado: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },

  // Link "Já tem conta? Entrar"
  linkEntrar: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },
});
