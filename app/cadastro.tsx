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
  StyleSheet
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { estilosLogin } from '../src/styles/_estilosLogin'; 
import { estilosGlobais } from '../src/componentes/estilosGlobais'; 

export default function TelaCadastro() {
  const router = useRouter();
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  const realizarCadastro = () => {
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
    Alert.alert('Sucesso', 'Conta criada com sucesso!');
    router.replace('/(tabs)/home');
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
                  resizeMode='contain' 
                />
              </View>

              <Text style={[estilosGlobais.subtitulo, { marginTop: 45 }]}>
                Crie sua conta financeira.
              </Text>

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

              <TouchableOpacity 
                style={[estilosGlobais.botaoPrimario, { width: '100%' }]} 
                onPress={realizarCadastro}
              >
                <Text style={estilosGlobais.textoBotaoPrimario}>Finalizar Cadastro</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.linkEntrar}
                onPress={() => router.back()}
              >
                <Text style={{ color: '#4b5563' }}>Já tem conta? </Text>
                <Text style={estilosGlobais.textoLink}>Entrar</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex1Width100: {
    flex: 1, 
    width: '100%'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80, 
    paddingBottom: 40,
  },
  cardAjustado: {
    width: '90%',
    maxWidth: 360,
    alignItems: 'center',
    marginTop: 0, 
  },
  logoInterna: {
    width: 210, 
    height: 210,
    alignSelf: 'center', 
  },
  linkEntrar: {
    flexDirection: 'row', 
    marginTop: 20, 
    marginBottom: 10,
    justifyContent: 'center'
  }
});