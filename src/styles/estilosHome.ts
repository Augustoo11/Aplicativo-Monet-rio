// src/styles/estilosHome.ts

import { StyleSheet } from 'react-native';
import { CORES } from '../config';

export const estilosHome = StyleSheet.create({

  container: { flex: 1, backgroundColor: CORES.fundo },
  conteudo: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },

  // Cabeçalho
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoBox: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  logoImagem: { width: 46, height: 46 },
  logoTexto: { fontSize: 22, fontWeight: 'bold', color: CORES.textoClaro },
  cabecalhoDireita: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botaoEngrenagem: { width: 40, height: 40, borderRadius: 20, backgroundColor: CORES.cartao, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: CORES.borda },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: CORES.cartao, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: CORES.borda },
  avatarTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  // Saldo
  saudacao: { color: CORES.textoMedio, fontSize: 14, marginBottom: 6 },
  saldo: { fontSize: 36, fontWeight: 'bold', marginBottom: 2 },
  labelSaldo: { color: CORES.textoEscuro, fontSize: 12, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Resumo de metas abaixo do valor líquido
  resumoMetas: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#FACC1510', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#FACC1530', alignSelf: 'flex-start' },
  resumoMetasTexto: { color: CORES.textoEscuro, fontSize: 12 },

  // Cartões
  filhaCartoes: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28, gap: 12 },
  cartao: { flex: 1, backgroundColor: CORES.cartao, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: CORES.borda },
  bolinha: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  labelCartao: { color: CORES.textoMedio, fontSize: 13 },
  valorCartao: { fontSize: 18, fontWeight: 'bold' },
  cartaoCabecalhoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },

  // Transações
  tituloSecao: { color: CORES.textoEscuro, fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 14 },
  areaFiltro: { flexDirection: 'row', marginBottom: 18, gap: 10 },
  botaoFiltro: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: CORES.cartao, borderWidth: 1, borderColor: CORES.borda },
  botaoFiltroAtivo: { backgroundColor: CORES.azul, borderColor: CORES.azul },
  textoFiltro: { color: CORES.textoMedio, fontSize: 13 },
  textoFiltroAtivo: { color: '#FFF', fontWeight: 'bold' },

  itemTransacao: { flexDirection: 'row', alignItems: 'center', backgroundColor: CORES.cartao, padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: CORES.borda },
  iconeTransacao: { width: 40, height: 40, borderRadius: 20, backgroundColor: CORES.fundo, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  nomeTransacao: { color: CORES.textoClaro, fontSize: 15, fontWeight: 'bold' },
  descricaoTransacao: { color: CORES.textoMedio, fontSize: 12, marginTop: 2 },
  dataTransacao: { color: CORES.textoEscuro, fontSize: 12, marginTop: 2 },
  valorTransacao: { fontSize: 15, fontWeight: 'bold', maxWidth: 110 },
  badgeMeta: { marginTop: 4, backgroundColor: '#FACC1520', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#FACC15' },
  badgeMetaTexto: { color: '#FACC15', fontSize: 11, fontWeight: 'bold' },
  textoVazio: { color: CORES.textoEscuro, textAlign: 'center', marginTop: 20 },

  // Botão de excluir na transação
  botaoExcluir: { padding: 8, marginLeft: 8 },

  // Barra inferior
  barraInferior: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: CORES.cartao, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 14, borderRadius: 30, borderWidth: 1, borderColor: CORES.borda },
  botaoNav: { alignItems: 'center', flex: 1 },
  textoNav: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  botaoAdicionar: { width: 56, height: 56, borderRadius: 28, backgroundColor: CORES.azul, justifyContent: 'center', alignItems: 'center', top: -20, shadowColor: CORES.azul, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },

  // Modal base
  overlayModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  conteudoModal: { backgroundColor: CORES.cartao, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  alcaModal: { width: 40, height: 4, backgroundColor: CORES.borda, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  tituloModal: { color: CORES.textoClaro, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  // Tipo: Receita / Despesa
  filhaTipo: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  botaoTipo: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: CORES.fundo, borderWidth: 1, borderColor: CORES.borda },
  textoTipo: { color: CORES.textoMedio, fontWeight: 'bold', fontSize: 15 },

  // Seção de meta
  secaoMeta: { backgroundColor: CORES.fundo, borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: CORES.borda },
  labelSecaoMeta: { color: CORES.textoMedio, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  botaoTipoMeta: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: CORES.cartao, borderWidth: 2, borderColor: CORES.borda },
  textoTipoMeta: { color: CORES.textoMedio, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  subtextoTipoMeta: { color: CORES.textoEscuro, fontSize: 11 },

  botaoMetaOpcao: { padding: 12, borderRadius: 12, backgroundColor: CORES.cartao, borderWidth: 1, borderColor: CORES.borda, marginBottom: 2 },
  textoMetaOpcao: { color: CORES.textoMedio, fontSize: 14, flex: 1 },
  miniBarraFundo: { height: 4, backgroundColor: CORES.borda, borderRadius: 2, overflow: 'hidden' },
  miniBarraProgresso: { height: '100%', backgroundColor: '#FACC15', borderRadius: 2 },
  miniBarraTexto: { color: CORES.textoEscuro, fontSize: 11, marginTop: 4 },

  avisoSemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: CORES.cartao, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: CORES.borda, marginBottom: 4 },
  avisoSemMetaTexto: { color: CORES.textoEscuro, fontSize: 13, flex: 1, lineHeight: 18 },

  // Campos do formulário
  labelCampo: { color: CORES.textoMedio, fontSize: 13, marginBottom: 8, marginTop: 4 },
  gradeCategorias: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  botaoCategoria: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: CORES.fundo, borderWidth: 1, borderColor: CORES.borda },
  botaoCategoriaAtivo: { backgroundColor: CORES.azul, borderColor: CORES.azul },
  textoCategoria: { color: CORES.textoMedio, fontSize: 13 },
  textoCategoriaAtivo: { color: '#FFF', fontWeight: 'bold' },
  input: { backgroundColor: CORES.fundo, color: CORES.textoClaro, padding: 14, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: CORES.borda, fontSize: 16 },
  filhaBotoes: { flexDirection: 'row', gap: 12, marginTop: 8 },
  botaoCancelar: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: CORES.fundo, alignItems: 'center', borderWidth: 1, borderColor: CORES.borda },
  textoCancelar: { color: CORES.textoMedio, fontWeight: 'bold', fontSize: 15 },
  botaoSalvar: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: CORES.azul, alignItems: 'center' },
  textoSalvar: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});
