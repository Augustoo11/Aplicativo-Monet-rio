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
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { estilosLogin } from '../src/styles/estilosLogin';
import { estilosGlobais } from '../src/styles/estilosGlobais';
import { API_URL } from '../src/config';

export default function TelaCadastro() {
  const router = useRouter();

  // Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados de controle da tela
  const [carregando, setCarregando] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

  // Configura a barra de status
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  // Função chamada ao pressionar "Finalizar Cadastro"
  async function realizarCadastro() {
    // Validações básicas
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);

    try {
      // 1. Cria a conta no backend
      const respostaCadastro = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.toLowerCase().trim(),
          senha: senha,
        }),
      });

      const textoResposta = await respostaCadastro.text();

      // Se o email já está em uso (status 409)
      if (respostaCadastro.status === 409) {
        Alert.alert('Atenção', 'E-mail já cadastrado. Tente fazer login.');
        return;
      }
      
      if (!respostaCadastro.ok) {
        Alert.alert('Erro', textoResposta || 'Não foi possível criar a conta. Tente novamente.');
        return;
      }

      // 2. Faz login automático após criar a conta
      const respostaLogin = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          senha: senha,
        }),
      });

      if (respostaLogin.ok) {
        const dados = await respostaLogin.json();

        // Salva os dados do usuário para uso em outras telas
        await AsyncStorage.setItem('@usuario_id', String(dados.id));
        await AsyncStorage.setItem('@usuario_nome', dados.nome);
        await AsyncStorage.setItem('@usuario_email', dados.email);
      }

      // Sucesso! Vai para a tela principal
      Alert.alert('Sucesso!', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
      ]);

    } catch (erro) {
      // ✅ Mostra o erro real no console também, ajuda a debugar
      console.log('Erro ao cadastrar:', erro);
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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, width: '100%' }}
        >
          <ScrollView
            contentContainerStyle={estilosLogin.scrollCadastro}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[estilosLogin.cartaoLogin, estilosLogin.cartaoAjustado]}>

              {/* Logo */}
              <View style={estilosLogin.iconeTopo}>
                <Image
                  source={require('../src/assets/logo.png')}
                  style={{ width: 110, height: 110 }}
                  resizeMode="contain"
                />
              </View>

              {/* Subtítulo */}
              <Text style={[estilosGlobais.subtitulo, { marginTop: 8 }]}>
                Crie sua conta financeira.
              </Text>

              {/* Campo: Nome */}
              <View style={[estilosGlobais.grupoEntrada, { width: '100%' }]}>
                <FontAwesome5 name="user" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
                <TextInput
                  style={estilosGlobais.campoTexto}
                  placeholder="Nome completo"
                  placeholderTextColor="#6b7280"
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

              {/* Campo: Email */}
              <View style={[estilosGlobais.grupoEntrada, { width: '100%' }]}>
                <FontAwesome5 name="envelope" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
                <TextInput
                  style={estilosGlobais.campoTexto}
                  placeholder="E-mail"
                  placeholderTextColor="#6b7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Campo: Senha com olhinho */}
              <View style={[estilosGlobais.grupoEntrada, { width: '100%' }]}>
                <FontAwesome5 name="lock" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
                <TextInput
                  style={[estilosGlobais.campoTexto, { flex: 1 }]}
                  placeholder="Senha (mínimo 6 caracteres)"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!senhaVisivel}
                  value={senha}
                  onChangeText={setSenha}
                />
                <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={{ paddingHorizontal: 10 }}>
                  <FontAwesome5 name={senhaVisivel ? 'eye-slash' : 'eye'} size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Campo: Confirmar Senha com olhinho */}
              <View style={[estilosGlobais.grupoEntrada, { width: '100%' }]}>
                <FontAwesome5 name="check-circle" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
                <TextInput
                  style={[estilosGlobais.campoTexto, { flex: 1 }]}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!confirmarSenhaVisivel}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
                <TouchableOpacity onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)} style={{ paddingHorizontal: 10 }}>
                  <FontAwesome5 name={confirmarSenhaVisivel ? 'eye-slash' : 'eye'} size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Botão principal */}
              <TouchableOpacity
                style={[estilosGlobais.botaoPrimario, { opacity: carregando ? 0.7 : 1 }]}
                onPress={realizarCadastro}
                disabled={carregando}
              >
                {carregando
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={estilosGlobais.textoBotaoPrimario}>Finalizar Cadastro</Text>
                }
              </TouchableOpacity>

              {/* Link para voltar ao login */}
              <TouchableOpacity style={estilosLogin.linkEntrar} onPress={() => router.back()}>
                <Text style={{ color: '#9ca3af', fontSize: 14 }}>Já tem conta? </Text>
                <Text style={estilosGlobais.textoLink}>Entrar</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
