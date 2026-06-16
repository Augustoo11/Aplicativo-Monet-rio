import { StyleSheet } from 'react-native';
import { CORES } from '../config';

export const estilosGlobais = StyleSheet.create({

  // Título grande (ex: "GestorFin")
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: CORES.textoClaro,
    textAlign: 'center',
    marginBottom: 6,
  },

  // Subtítulo menor (ex: "Controle seu futuro financeiro")
  subtitulo: {
    fontSize: 14,
    color: CORES.textoMedio,
    textAlign: 'center',
    marginBottom: 24,
  },

  // Linha que envolve ícone + campo de texto
  grupoEntrada: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 14,
    paddingHorizontal: 14,
    width: '100%',
  },

  // Campo de texto dentro do grupoEntrada
  campoTexto: {
    flex: 1,
    height: 50,
    color: CORES.textoClaro,
    fontSize: 15,
    paddingVertical: 0,
  },

  // Ícone à esquerda do campo
  iconeEspacamento: {
    marginRight: 10,
  },

  // Botão azul principal (ex: "Entrar", "Salvar")
  botaoPrimario: {
    backgroundColor: CORES.azul,
    borderRadius: 12,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  // Texto branco dentro do botão primário
  textoBotaoPrimario: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Texto de link clicável (ex: "Cadastre-se!")
  textoLink: {
    color: CORES.azul,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
