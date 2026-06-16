import { StyleSheet } from 'react-native';
import { CORES } from '../config';

export const estilosMetas = StyleSheet.create({

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
    marginBottom: 24,
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
  botaoNovaMeta: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CORES.azul,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Banner de resumo ───────────────────────────────────────
  bannerResumo: {
    backgroundColor: CORES.cartao,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: CORES.borda,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerItem: {
    alignItems: 'center',
    flex: 1,
  },
  bannerDivisor: {
    width: 1,
    height: 36,
    backgroundColor: CORES.borda,
  },
  bannerLabel: {
    color: CORES.textoEscuro,
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bannerValor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: CORES.textoClaro,
  },

  // ── Estado vazio ───────────────────────────────────────────
  caixaVazia: {
    alignItems: 'center',
    marginTop: 60,
    gap: 14,
    paddingHorizontal: 20,
  },
  iconeVazio: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: CORES.cartao,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.borda,
    marginBottom: 4,
  },
  textoVazio: {
    color: CORES.textoClaro,
    fontSize: 17,
    fontWeight: 'bold',
  },
  subtextoVazio: {
    color: CORES.textoEscuro,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  botaoPrimeiraMeta: {
    marginTop: 8,
    backgroundColor: CORES.azul,
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  botaoPrimeiraMetaTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // ── Cartão de meta ─────────────────────────────────────────
  cartaoMeta: {
    backgroundColor: CORES.cartao,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  cartaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  iconeMetaBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FACC1520',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FACC1540',
  },
  nomeMeta: {
    color: CORES.textoClaro,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusMeta: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  acoesCartao: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  botaoContribuir: {
    backgroundColor: '#FACC1520',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FACC1540',
  },

  // ── Valores ────────────────────────────────────────────────
  linhaValores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelValor: {
    color: CORES.textoEscuro,
    fontSize: 13,
  },
  valorTexto: {
    color: CORES.textoClaro,
    fontSize: 13,
    fontWeight: 'bold',
  },

  // ── Barra de progresso ─────────────────────────────────────
  barraFundo: {
    height: 8,
    backgroundColor: CORES.fundo,
    borderRadius: 4,
    marginTop: 14,
    overflow: 'hidden',
  },
  barraProgresso: {
    height: '100%',
    borderRadius: 4,
  },
  percentual: {
    color: CORES.textoEscuro,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },

  // ── Caixa meta concluída ───────────────────────────────────
  caixaConcluida: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CORES.verde,
  },

  // ── Modal base ─────────────────────────────────────────────
  overlayModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  conteudoModal: {
    backgroundColor: CORES.cartao,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
  },
  alcaModal: {
    width: 40,
    height: 4,
    backgroundColor: CORES.borda,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  tituloModal: {
    color: CORES.textoClaro,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  // ── Campos do formulário ───────────────────────────────────
  labelCampo: {
    color: CORES.textoMedio,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: CORES.fundo,
    color: CORES.textoClaro,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
    fontSize: 16,
  },

  // ── Seletor de data ────────────────────────────────────────
  botaoToggleData: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: CORES.fundo,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  botaoToggleDataAtivo: {
    backgroundColor: CORES.azul,
    borderColor: CORES.azul,
  },
  textoToggleData: {
    color: CORES.textoMedio,
    fontWeight: 'bold',
    fontSize: 14,
  },
  caixaData: {
    backgroundColor: CORES.fundo,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  labelDataPequeno: {
    color: CORES.textoClaro,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 14,
  },
  labelSeletor: {
    color: CORES.textoEscuro,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  chipData: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: CORES.cartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    marginRight: 8,
    minWidth: 52,
    alignItems: 'center',
  },
  chipDataPequeno: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: CORES.cartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    marginRight: 6,
    minWidth: 42,
    alignItems: 'center',
  },
  chipDataAtivo: {
    backgroundColor: '#FACC15',
    borderColor: '#FACC15',
  },
  textoChipData: {
    color: CORES.textoMedio,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Caixa de info da meta (modal contribuição) ─────────────
  caixaInfoMeta: {
    backgroundColor: CORES.fundo,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  nomeInfoMeta: {
    color: CORES.textoClaro,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  // ── Botões ─────────────────────────────────────────────────
  filhaBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  botaoCancelar: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: CORES.fundo,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  textoCancelar: {
    color: CORES.textoMedio,
    fontWeight: 'bold',
    fontSize: 15,
  },
  botaoSalvar: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: CORES.azul,
    alignItems: 'center',
  },
  botaoSalvarAmarelo: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#FACC15',
    alignItems: 'center',
  },
  textoSalvar: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textoSalvarAmarelo: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
