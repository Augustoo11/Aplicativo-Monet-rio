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
  Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { StatusBar } from 'react-native';
import { useEffect } from 'react';

// Importa os estilos (verifique se os caminhos continuam batendo com sua pasta src)
import { estilosLogin } from '../src/styles/_estilosLogin'; 
import { estilosGlobais } from '../src/componentes/estilosGlobais'; 

export default function TelaDeLogin() {
  const [email, definirEmail] = useState<string>('');
  const [senha, definirSenha] = useState<string>('');
  const router = useRouter(); 

  useEffect(() => {
  StatusBar.setBarStyle('light-content');
  StatusBar.setBackgroundColor('transparent');
  StatusBar.setTranslucent(true);
}, []);

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
      source={require('../src/assets/Fundo.png')}
      style={estilosLogin.imagemFundo}
    >
      <View style={estilosLogin.peliculaEscura}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={estilosLogin.areaPrincipal}
        >
          <View style={estilosLogin.cartaoLogin}>
            
            <View style={estilosLogin.iconeTopo}>
            <Image 
            source={require('../src/assets/logo.png')} 
            style={estilosLogin.iconeTopo}
            height={210}
            width={210}
            resizeMode=  'contain'
            />
            </View>

            <Text style={estilosGlobais.tituloPrincipal}></Text>
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