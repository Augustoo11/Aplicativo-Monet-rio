// app/index.tsx
// ─────────────────────────────────────────────────────────────
// Tela de Login — primeira tela que o usuário vê.
// Envia email e senha para o backend e, se correto,
// salva os dados do usuário e vai para a tela principal.
// ─────────────────────────────────────────────────────────────

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
  // Estado dos campos do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estado de controle da tela
  const [carregando, setCarregando] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const router = useRouter();

  // Configura a barra de status para ficar transparente sobre a imagem de fundo
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }, []);

  // Função chamada ao pressionar "Entrar"
  async function realizarLogin() {
    // Verifica se os campos foram preenchidos
    if (!email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha seu e-mail e senha.');
      return;
    }

    setCarregando(true);

    try {
      // Envia o email e senha para o backend
      const resposta = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          senha: senha,
        }),
      });

      const dados = await resposta.json();

      // Se o servidor retornar 401, as credenciais estão erradas
      if (resposta.status === 401) {
        Alert.alert('Atenção', 'E-mail ou senha inválidos.');
        return;
      }

      // Se houver outro erro
      if (!resposta.ok) {
        Alert.alert('Erro', dados.mensagem || 'Não foi possível fazer login.');
        return;
      }

      // Login OK! Salva os dados do usuário para usar em outras telas
      await AsyncStorage.setItem('@usuario_id', String(dados.id));
      await AsyncStorage.setItem('@usuario_nome', dados.nome);
      await AsyncStorage.setItem('@usuario_email', dados.email);

      // Vai para a tela principal
      router.replace('/(tabs)/home');

    } catch (erro) {
      // Erro de conexão (backend fora do ar, URL errada, etc.)
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
      {/* Camada escura para melhorar legibilidade */}
      <View style={estilosLogin.peliculaEscura}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={estilosLogin.areaPrincipal}
        >
          {/* Cartão de login */}
          <View style={estilosLogin.cartaoLogin}>

            {/* Logo do app */}
            <View style={estilosLogin.iconeTopo}>
              <Image
                source={require('../src/assets/logo.png')}
                style={{ width: 110, height: 110 }}
                resizeMode="contain"
              />
            </View>

            {/* Subtítulo */}
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

            {/* Campo de senha com botão de mostrar/ocultar */}
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
              {/* Botão do olhinho para mostrar/ocultar a senha */}
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={{ paddingHorizontal: 10 }}>
                <FontAwesome5
                  name={senhaVisivel ? 'eye-slash' : 'eye'}
                  size={16}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* Botão principal de entrar */}
            <TouchableOpacity
              style={[estilosGlobais.botaoPrimario, { opacity: carregando ? 0.7 : 1 }]}
              onPress={realizarLogin}
              disabled={carregando}
            >
              {/* Mostra o spinner enquanto carrega, senão mostra o texto */}
              {carregando
                ? <ActivityIndicator color="#fff" />
                : <Text style={estilosGlobais.textoBotaoPrimario}>Entrar</Text>
              }
            </TouchableOpacity>

            {/* Link para a tela de cadastro */}
            <TouchableOpacity
              style={{ flexDirection: 'row', marginTop: 18 }}
              onPress={() => router.push('/cadastro')}
            >
              <Text style={{ color: '#9ca3af', fontSize: 14 }}>Não possui uma conta? </Text>
              <Text style={estilosGlobais.textoLink}>Cadastre-se!</Text>
            </TouchableOpacity>

            {/* Link de recuperar senha (sem funcionalidade por enquanto) */}
            <TouchableOpacity style={estilosLogin.botaoEsqueciSenha}>
              <Text style={estilosGlobais.textoLink}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
