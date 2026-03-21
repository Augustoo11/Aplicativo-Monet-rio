import { StyleSheet } from 'react-native';

export const estilosLogin = StyleSheet.create({
  imagemFundo: {
    flex: 1,
    width: '100%',
  },
  peliculaEscura: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 24,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 40, 
  },
  iconeTopo: {
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -40, 
    zIndex: 10,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  botaoEsqueciSenha: {
    marginTop: 20,
  },
});