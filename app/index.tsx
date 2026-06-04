import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'react-native';

import { estilosLogin } from '../src/styles/_estilosLogin';
import { estilosGlobais } from '../src/componentes/estilosGlobais';

const API_URL = 'https://reimagined-enigma-wvrrx4xrq599cgjx6-8080.app.github.dev';

export default function TelaDeLogin() {
  const [email, definirEmail]             = useState<string>('');
  const [senha, definirSenha]             = useState<string>('');
  const [carregando, setCarregando]       = useState<boolean>(false);
  const [senhaVisivel, setSenhaVisivel]   = useState<boolean>(false); // ← olhinho
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }, []);

  const realizarLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha seu e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      const resposta = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          senha,
        }),
      });
      const dados = await resposta.json();
      if (resposta.status === 401) {
        Alert.alert('Atenção', 'E-mail ou senha inválidos.');
        return;
      }
      if (!resposta.ok) {
        Alert.alert('Erro', dados.mensagem || 'Não foi possível fazer login. Tente novamente.');
        return;
      }
      await AsyncStorage.setItem('@usuario_id', dados.id);
      await AsyncStorage.setItem('@usuario_nome', dados.nome);
      await AsyncStorage.setItem('@usuario_email', dados.email);
      router.replace('/(tabs)/home');
    } catch (erro) {
      Alert.alert(
        'Erro de conexão',
        'Não foi possível conectar ao servidor.\nVerifique se o back-end está rodando e se a URL do Codespace está correta.'
      );
    } finally {
      setCarregando(false);
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
                resizeMode="contain"
              />
            </View>

            <Text style={estilosGlobais.tituloPrincipal}></Text>
            <Text style={estilosGlobais.subtitulo}>Controle seu futuro financeiro.</Text>

            {/* EMAIL */}
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

            {/* SENHA com olhinho */}
            <View style={estilosGlobais.grupoEntrada}>
              <FontAwesome5 name="lock" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
              <TextInput
                style={[estilosGlobais.campoTexto, { flex: 1 }]}
                placeholder="Sua senha"
                secureTextEntry={!senhaVisivel}
                value={senha}
                onChangeText={definirSenha}
              />
              <TouchableOpacity
                onPress={() => setSenhaVisivel(!senhaVisivel)}
                style={{ paddingHorizontal: 10 }}
              >
                <FontAwesome5
                  name={senhaVisivel ? 'eye-slash' : 'eye'}
                  size={16}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* BOTÃO ENTRAR */}
            <TouchableOpacity
              style={[estilosGlobais.botaoPrimario, { opacity: carregando ? 0.7 : 1 }]}
              onPress={realizarLogin}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={estilosGlobais.textoBotaoPrimario}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* LINK CADASTRO */}
            <TouchableOpacity
              style={{ flexDirection: 'row', marginTop: 15 }}
              onPress={() => router.push('/cadastro')}
            >
              <Text>Não possui uma conta? </Text>
              <Text style={estilosGlobais.textoLink}>Cadastre-se!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilosLogin.botaoEsqueciSenha}>
              <Text style={estilosGlobais.textoLink}>Esqueceu a senha?</Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}