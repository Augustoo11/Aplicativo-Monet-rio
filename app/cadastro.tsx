import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

import { useRouter } from 'expo-router';
import { estilosGlobais } from '../src/componentes/estilosGlobais';
import { styles } from '../src/styles/_estilosCadastro'; // Ajustado para a nova pasta

export default function TelaCadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erros, setErros] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  function validarEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function cadastrar() {
    let novosErros = {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: ''
    };

    if (!nome) novosErros.nome = 'Nome é obrigatório';

    if (!email) novosErros.email = 'Email é obrigatório';
    else if (!validarEmail(email)) novosErros.email = 'Email inválido';

    if (!senha) novosErros.senha = 'Senha é obrigatória';
    else if (senha.length < 6) novosErros.senha = 'Mínimo 6 caracteres';

    if (!confirmarSenha) novosErros.confirmarSenha = 'Confirme sua senha';
    else if (senha !== confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem';

    setErros(novosErros);

    const temErro = Object.values(novosErros).some(e => e !== '');
    if (temErro) return;

    Alert.alert('Sucesso', 'Conta criada com sucesso!');
    router.replace('/(tabs)/home');
  }

  const tudoPreenchido = nome && email && senha && confirmarSenha;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        
        <Text style={styles.titulo}>Criar Conta</Text>
        <Text style={styles.subtitulo}>Preencha os dados para começar.</Text>

        {/* Nome */}
        <View style={styles.grupo}>
          <Text style={styles.label}>
            Nome Completo <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={[estilosGlobais.campoTexto, styles.input, erros.nome && styles.inputErro]}
            value={nome}
            onChangeText={setNome}
          />
          {!!erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}
        </View>

        {/* Email */}
        <View style={styles.grupo}>
          <Text style={styles.label}>
            Email <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={[estilosGlobais.campoTexto, styles.input, erros.email && styles.inputErro]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {!!erros.email && <Text style={styles.erro}>{erros.email}</Text>}
        </View>

        {/* Senha */}
        <View style={styles.grupo}>
          <Text style={styles.label}>
            Senha <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={[estilosGlobais.campoTexto, styles.input, erros.senha && styles.inputErro]}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          {!!erros.senha && <Text style={styles.erro}>{erros.senha}</Text>}
        </View>

        {/* Confirmar Senha */}
        <View style={styles.grupo}>
          <Text style={styles.label}>
            Confirmar Senha <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={[estilosGlobais.campoTexto, styles.input, erros.confirmarSenha && styles.inputErro]}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
          {!!erros.confirmarSenha && (
            <Text style={styles.erro}>{erros.confirmarSenha}</Text>
          )}
        </View>

        {/* Botão */}
        <TouchableOpacity 
          style={[
            estilosGlobais.botaoPrimario,
            !tudoPreenchido && { backgroundColor: '#93c5fd' }
          ]} 
          onPress={cadastrar} 
          disabled={!tudoPreenchido}
        >
          <Text style={estilosGlobais.textoBotaoPrimario}>
            Finalizar Cadastro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>
            Já tem uma conta? Faça Login
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}