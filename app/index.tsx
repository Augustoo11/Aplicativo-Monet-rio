import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

// Importa os estilos (verifique se os caminhos continuam batendo com sua pasta src)
import { estilosLogin } from './estilosLogin'; 
import { estilosGlobais } from '../src/componentes/estilosGlobais'; 

export default function TelaDeLogin() {
  const [email, definirEmail] = useState<string>('');
  const [senha, definirSenha] = useState<string>('');
  const router = useRouter(); 

  const realizarLogin = () => {
    if (email !== '' && senha !== '') {
      // replace: o usuário entra e não consegue "voltar" para o login pelo botão do celular
      router.replace('/(tabs)/home'); 
    } else {
      Alert.alert('Atenção', 'Por favor, preencha seu e-mail e senha.');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1920&auto=format&fit=crop' }}
      style={estilosLogin.imagemFundo}
    >
      <View style={estilosLogin.peliculaEscura}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={estilosLogin.areaPrincipal}
        >
          <View style={estilosLogin.cartaoLogin}>
            
            <View style={estilosLogin.iconeTopo}>
              <FontAwesome5 name="chart-line" size={32} color="#3b82f6" />
            </View>

            <Text style={estilosGlobais.tituloPrincipal}>GESTORFIN</Text>
            <Text style={estilosGlobais.subtitulo}>Controle seu futuro financeiro.</Text>

            {/* Campo de E-mail */}
            <View style={estilosGlobais.grupoEntrada}>
              <FontAwesome5 name="envelope" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
              <TextInput
                style={estilosGlobais.campoTexto}
                placeholder="Seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={definirEmail}
              />
            </View>

            {/* Campo de Senha */}
            <View style={estilosGlobais.grupoEntrada}>
              <FontAwesome5 name="lock" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
              <TextInput
                style={estilosGlobais.campoTexto}
                placeholder="Sua senha"
                secureTextEntry={true} 
                value={senha}
                onChangeText={definirSenha}
              />
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity style={estilosGlobais.botaoPrimario} onPress={realizarLogin}>
              <Text style={estilosGlobais.textoBotaoPrimario}>Entrar</Text>
            </TouchableOpacity>

            {/* Botão Cadastre-se */}
            <TouchableOpacity 
              style={{ flexDirection: 'row', marginTop: 15 }}
              onPress={() => router.push('/cadastro')} // Temporariamente para a home até você criar a tela de cadastro
            >
              <Text>Não possui uma conta? </Text>
              <Text style={estilosGlobais.textoLink}>Cadastre-se!</Text>
            </TouchableOpacity>

            {/* Botão Esqueci a Senha */}
            <TouchableOpacity style={estilosLogin.botaoEsqueciSenha}>
              <Text style={estilosGlobais.textoLink}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}