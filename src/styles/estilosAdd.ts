// src/styles/estilosAdd.ts
// ─────────────────────────────────────────────────────────────
// Estilos da tela app/(tabs)/add.tsx
// Separado do componente para deixar o código mais organizado.
// ─────────────────────────────────────────────────────────────

import { StyleSheet } from 'react-native';
import { CORES } from '../config';

export const estilosAdd = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  scroll: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },

  // Título
  tituloPagina: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CORES.textoClaro,
    marginBottom: 24,
    textAlign: 'center',
  },

  // Tipo (Receita / Despesa)
  filhaTipo: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  botaoTipo: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  textoTipo: {
    color: CORES.textoMedio,
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Categorias
  labelCampo: {
    color: CORES.textoMedio,
    fontSize: 13,
    marginBottom: 10,
  },
  gradeCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  botaoCategoria: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: CORES.cartao,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  botaoCategoriaAtivo: {
    backgroundColor: CORES.azul,
    borderColor: CORES.azul,
  },
  textoCategoria: {
    color: CORES.textoMedio,
    fontSize: 13,
  },
  textoCategoriaAtivo: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Inputs
  input: {
    backgroundColor: CORES.cartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    color: CORES.textoClaro,
    fontSize: 16,
  },

  // Botão salvar
  botaoSalvar: {
    backgroundColor: CORES.azul,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 28,
  },
  textoSalvar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Resumo financeiro
  resumo: {
    flexDirection: 'row',
    backgroundColor: CORES.cartao,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  itemResumo: {
    flex: 1,
    alignItems: 'center',
  },
  labelResumo: {
    fontSize: 11,
    color: CORES.textoEscuro,
    marginBottom: 4,
  },
  valorResumo: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  divisorResumo: {
    width: 1,
    height: 30,
    backgroundColor: CORES.borda,
  },

  // Label de seção
  labelSecao: {
    fontSize: 11,
    fontWeight: '700',
    color: CORES.textoEscuro,
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Item de transação na lista
  itemTransacao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  barraCor: {
    width: 4,
    alignSelf: 'stretch',
  },
  nomeTransacao: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textoClaro,
  },
  dataTransacao: {
    fontSize: 11,
    color: CORES.textoEscuro,
    marginTop: 2,
  },
  valorTransacao: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingRight: 14,
  },
});
