import { StyleSheet } from 'react-native';

export const estilosLogin = StyleSheet.create({
  imagemFundo: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  peliculaEscura: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaPrincipal: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cartaoLogin: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(255,255,255,0.95)', 
    borderRadius: 24,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 40, 
    shadowOpacity: 0.08,
    shadowRadius: 25,
  },
  iconeTopo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -46, 
    zIndex: 10,
    elevation: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  botaoEsqueciSenha: {
    marginTop: 20,
  },
});