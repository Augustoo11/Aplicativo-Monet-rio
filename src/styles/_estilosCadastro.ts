import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  grupo: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  asterisco: {
    color: 'red',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  inputErro: {
    borderColor: 'red',
  },
  erro: {
    color: 'red',
    marginTop: 5,
  },
  // Estes estilos abaixo (botao e textoBotao) não estavam 
  // sendo usados no seu TSX original, mas eu mantive.
  botao: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
    color: '#4A90E2',
  },
});