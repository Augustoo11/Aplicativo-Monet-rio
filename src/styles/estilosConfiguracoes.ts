import { StyleSheet } from 'react-native';
import { CORES } from '../config';

export const estilosConfiguracoes = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // ── Cabeçalho ──────────────────────────────────────────────
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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

  // ── Card do usuário ────────────────────────────────────────
  cardUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.cartao,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  avatarGrande: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: CORES.azul,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  nomeUsuario: {
    color: CORES.textoClaro,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emailUsuario: {
    color: CORES.textoEscuro,
    fontSize: 13,
    marginTop: 2,
  },

  // ── Título de seção ────────────────────────────────────────
  tituloSecao: {
    color: CORES.textoEscuro,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
  },

  // ── Card de resumo de metas ────────────────────────────────
  cardResumoMetas: {
    flexDirection: 'row',
    backgroundColor: CORES.cartao,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CORES.borda,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  resumoMetaItem: {
    alignItems: 'center',
    flex: 1,
  },
  resumoMetaNumero: {
    color: CORES.textoClaro,
    fontSize: 22,
    fontWeight: 'bold',
  },
  resumoMetaLabel: {
    color: CORES.textoEscuro,
    fontSize: 11,
    marginTop: 2,
  },
  resumoMetaDivisor: {
    width: 1,
    height: 32,
    backgroundColor: CORES.borda,
  },

  // ── Opção clicável ─────────────────────────────────────────
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

  // ── Caixa de informação ────────────────────────────────────
  caixaInfo: {
    backgroundColor: CORES.cartao,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  caixaInfoTitulo: {
    color: CORES.textoClaro,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },
  caixaInfoTexto: {
    color: CORES.textoMedio,
    fontSize: 13,
    lineHeight: 20,
  },
});
