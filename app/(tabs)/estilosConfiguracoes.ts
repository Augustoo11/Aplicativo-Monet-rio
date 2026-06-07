// app/(tabs)/estilosConfiguracoes.ts
// Estilos da tela Configurações — separados do componente.

import { StyleSheet } from 'react-native';
import { CORES } from '../../src/config';

export const estilosConfiguracoes = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CORES.cartao,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  titulo: {
    color: CORES.textoClaro,
    fontSize: 18,
    fontWeight: 'bold',
  },
  espacador: {
    width: 40,
  },

  // Título de seção
  tituloSecao: {
    color: CORES.textoEscuro,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Opção clicável
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CORES.cartao,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  opcaoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconeBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opcaoTitulo: {
    color: CORES.textoClaro,
    fontSize: 15,
    fontWeight: 'bold',
  },
  opcaoDescricao: {
    color: CORES.textoEscuro,
    fontSize: 12,
    marginTop: 2,
  },
});
