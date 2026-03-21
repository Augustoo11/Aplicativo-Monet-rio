import { StyleSheet } from 'react-native';

export const estilosGlobais = StyleSheet.create({
  // --- TEXTOS E TÍTULOS ---
  tituloPrincipal: {
    fontSize: 24,
    color: '#1f2937',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 30,
  },

  // --- INPUTS (Campos de Digitação) ---
  grupoEntrada: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  iconeEspacamento: {
    marginRight: 12,
  },
  campoTexto: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    height: '100%',
  },

  // --- BOTÕES ---
  botaoPrimario: {
    width: '100%',
    backgroundColor: '#3b82f6', // Azul principal do app
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoPrimario: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoLink: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '600',
  },
});

