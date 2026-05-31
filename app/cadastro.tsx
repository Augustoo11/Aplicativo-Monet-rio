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
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { estilosLogin } from '../src/styles/_estilosLogin';
import { estilosGlobais } from '../src/componentes/estilosGlobais';

// ⚠️ URL do seu Codespace — porta 8080
// ✅ Sem barra no final
const API_URL = 'https://reimagined-enigma-wvrrx4xrq599cgjx6-8080.app.github.dev';

export default function TelaCadastro() {
  const router = useRouter();

  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  const realizarCadastro = async () => {
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
      // PASSO 1 — Cria o usuário no banco (POST /usuarios)
      const respostaCadastro = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.toLowerCase().trim(),
          senha,
        }),
      });

      // E-mail já cadastrado
      if (respostaCadastro.status === 409) {
        Alert.alert('Atenção', 'E-mail já cadastrado. Tente fazer login.');
        return;
      }

      if (!respostaCadastro.ok) {
        Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
        return;
      }

      // PASSO 2 — Faz login automático para pegar o ID do usuário
      const respostaLogin = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          senha,
        }),
      });

      if (respostaLogin.ok) {
        const dados = await respostaLogin.json();

        // Salva os dados do usuário localmente
        await AsyncStorage.setItem('@usuario_id', String(dados.id));
        await AsyncStorage.setItem('@usuario_nome', dados.nome);
        await AsyncStorage.setItem('@usuario_email', dados.email);
      }

      // ✅ Cadastro feito — vai para a home
      Alert.alert('Sucesso!', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
      ]);

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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex1Width100}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[estilosLogin.cartaoLogin, styles.cardAjustado]}>

              <View style={estilosLogin.iconeTopo}>
                <Image
                  source={require('../src/assets/logo.png')}
                  style={styles.logoInterna}
                  resizeMode="contain"
                />
              </View>

              <Text style={[estilosGlobais.subtitulo, { marginTop: 45 }]}>
                Crie sua conta financeira.
              </Text>

              {/* NOME */}
              <View style={[estilosGlobais.grupoEntrada, { width: '100%' }]}>
                <FontAwesome5 name="user" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
                <TextInput
                  style={estilosGlobais.campoTexto}
                  placeholder="Nome completo"
                  placeholderTextColor="#9ca3af"
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

              {/* EMAIL */}
              <View style={[estilosGlobais.grupoEntrada, { width: '100%' }]}>
                <FontAwesome5 name="envelope" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
                <TextInput
                  style={estilosGlobais.campoTexto}
                  placeholder="E-mail"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* SENHA */}
              <View style={[estilosGlobais.grupoEntrada, { width: '100%' }]}>
                <FontAwesome5 name="lock" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
                <TextInput
                  style={estilosGlobais.campoTexto}
                  placeholder="Senha"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={true}
                  value={senha}
                  onChangeText={setSenha}
                />
              </View>

              {/* CONFIRMAR SENHA */}
              <View style={[estilosGlobais.grupoEntrada, { width: '100%' }]}>
                <FontAwesome5 name="check-circle" size={16} color="#9ca3af" style={estilosGlobais.iconeEspacamento} />
                <TextInput
                  style={estilosGlobais.campoTexto}
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={true}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
              </View>

              {/* BOTÃO */}
              <TouchableOpacity
                style={[estilosGlobais.botaoPrimario, { width: '100%', opacity: carregando ? 0.7 : 1 }]}
                onPress={realizarCadastro}
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={estilosGlobais.textoBotaoPrimario}>Finalizar Cadastro</Text>
                )}
              </TouchableOpacity>

              {/* LINK LOGIN */}
              <TouchableOpacity style={styles.linkEntrar} onPress={() => router.back()}>
                <Text style={{ color: '#4b5563' }}>Já tem conta?</Text>
                <Text style={estilosGlobais.textoLink}>{' '}Entrar</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex1Width100: { flex: 1, width: '100%' },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  cardAjustado: { width: '90%', maxWidth: 360, alignItems: 'center', marginTop: 0 },
  logoInterna: { width: 210, height: 210, alignSelf: 'center' },
  linkEntrar: { flexDirection: 'row', marginTop: 20, marginBottom: 10, justifyContent: 'center' },
});