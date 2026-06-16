// src/styles/estilosLogin.ts
// Estilos das telas de Login e Cadastro.

import { StyleSheet } from 'react-native';

export const estilosLogin = StyleSheet.create({

  imagemFundo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  peliculaEscura: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  areaPrincipal: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

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

  iconeTopo: {
    marginBottom: 12,
    alignItems: 'center',
  },

  logo: {
    width: 180,
    height: 180,
  },

  botaoEsqueciSenha: {
    marginTop: 12,
  },

  scrollCadastro: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },

  cartaoAjustado: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },

  linkEntrar: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },
});
