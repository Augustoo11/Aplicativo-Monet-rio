// app/index.tsx — Tela de Login

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
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { estilosLogin } from '../src/styles/estilosLogin';
import { estilosGlobais } from '../src/styles/estilosGlobais';
import { API_URL } from '../src/config';

export default function TelaDeLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }, []);

  async function realizarLogin() {
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
          senha: senha,
        }),
      });

      const dados = await resposta.json();

      if (resposta.status === 401) {
        Alert.alert('Atenção', 'E-mail ou senha inválidos.');
        return;
      }

      if (!resposta.ok) {
        Alert.alert('Erro', dados.mensagem || 'Não foi possível fazer login.');
        return;
      }

      await AsyncStorage.setItem('@usuario_id', String(dados.id));
      await AsyncStorage.setItem('@usuario_nome', dados.nome);
      await AsyncStorage.setItem('@usuario_email', dados.email);

      router.replace('/(tabs)/home');

    } catch (erro) {
      Alert.alert(
        'Erro de conexão',
        'Não foi possível conectar ao servidor.\nVerifique se o backend está rodando.'
      );
    } finally {
      setCarregando(false);
    }
  }

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

            {/* ✅ Logo com tamanho corrigido */}
            <View style={estilosLogin.iconeTopo}>
              <Image
                source={require('../src/assets/logo.png')}
                style={estilosLogin.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={estilosGlobais.subtitulo}>Controle seu futuro financeiro.</Text>

            {/* Campo de email */}
            <View style={estilosGlobais.grupoEntrada}>
              <FontAwesome5 name="envelope" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
              <TextInput
                style={estilosGlobais.campoTexto}
                placeholder="Seu e-mail"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Campo de senha */}
            <View style={estilosGlobais.grupoEntrada}>
              <FontAwesome5 name="lock" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
              <TextInput
                style={[estilosGlobais.campoTexto, { flex: 1 }]}
                placeholder="Sua senha"
                placeholderTextColor="#6b7280"
                secureTextEntry={!senhaVisivel}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={{ paddingHorizontal: 10 }}>
                <FontAwesome5
                  name={senhaVisivel ? 'eye-slash' : 'eye'}
                  size={16}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity
              style={[estilosGlobais.botaoPrimario, { opacity: carregando ? 0.7 : 1 }]}
              onPress={realizarLogin}
              disabled={carregando}
            >
              {carregando
                ? <ActivityIndicator color="#fff" />
                : <Text style={estilosGlobais.textoBotaoPrimario}>Entrar</Text>
              }
            </TouchableOpacity>

            {/* Link para cadastro */}
            <TouchableOpacity
              style={{ flexDirection: 'row', marginTop: 18 }}
              onPress={() => router.push('/cadastro')}
            >
              <Text style={{ color: '#9ca3af', fontSize: 14 }}>Não possui uma conta? </Text>
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
