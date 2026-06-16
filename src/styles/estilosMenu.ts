import { StyleSheet } from 'react-native';

export const estilosMenu = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // fundo claro para a tela de relatórios
  },
  scroll: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },

  // Título
  tituloPagina: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },

  // Estado vazio
  caixaVazia: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emoticonVazio: {
    fontSize: 48,
    marginBottom: 12,
  },
  tituloVazio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtituloVazio: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  // Filha de cartões
  filhaCartoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  // Cartão genérico
  cartao: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 0,
  },
  labelCartao: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 6,
  },
  valorCartao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  valorCartaoGrande: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtituloCartao: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },

  // Título de seção
  tituloSecao: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 8,
  },

  // Barras de comparativo
  labelBarra: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
  },
  barraFundo: {
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barraPreenchimento: {
    height: '100%',
    borderRadius: 5,
  },
  valorBarra: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },

  // Linha de categoria
  linhaCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#f3f4f6',
  },
  bolinhaCategoria: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nomeCategoria: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
  barraCategoria: {
    width: 60,
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barraPreenchimentoCat: {
    height: '100%',
    borderRadius: 3,
  },
  valorCategoria: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    width: 80,
    textAlign: 'right',
  },
});
