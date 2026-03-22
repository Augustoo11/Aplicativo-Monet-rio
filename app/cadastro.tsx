import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { estilosGlobais } from '../src/componentes/estilosGlobais'; // Ajuste o caminho se necessário

export default function TelaCadastro() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={estilosGlobais.tituloPrincipal}>Criar Conta</Text>
      <Text style={estilosGlobais.subtitulo}>Preencha os dados para começar.</Text>

      {/* Exemplo de campo */}
      <View style={estilosGlobais.grupoEntrada}>
        <TextInput 
          style={estilosGlobais.campoTexto} 
          placeholder="Nome Completo" 
        />
      </View>

      <TouchableOpacity 
        style={estilosGlobais.botaoPrimario} 
        onPress={() => router.replace('/(tabs)/home')}
      >
        <Text style={estilosGlobais.textoBotaoPrimario}>Finalizar Cadastro</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={estilosGlobais.textoLink}>Já tem uma conta? Faça Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20
  }
});