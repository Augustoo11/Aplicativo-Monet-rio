import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

export default function Add() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');

  function salvar() {
    if (!descricao || !valor) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    Alert.alert(
      'Sucesso 💸',
      `Transação adicionada:\n${descricao} - R$ ${valor}`
    );

    // limpar campos
    setDescricao('');
    setValor('');
    setTipo('despesa');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.titulo}>Apenas Teste</Text>

        {/* Tipo */}
        <View style={styles.tipoContainer}>
          <TouchableOpacity
            style={[
              styles.tipoBotao,
              tipo === 'receita' && styles.receita
            ]}
            onPress={() => setTipo('receita')}
          >
            <Text style={styles.tipoTexto}>Receita</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tipoBotao,
              tipo === 'despesa' && styles.despesa
            ]}
            onPress={() => setTipo('despesa')}
          >
            <Text style={styles.tipoTexto}>Despesa</Text>
          </TouchableOpacity>
        </View>

        {/* Descrição */}
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Valor */}
        <TextInput
          style={styles.input}
          placeholder="Valor (R$)"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        {/* Botão */}
        <TouchableOpacity style={styles.botao} onPress={salvar}>
          <Text style={styles.botaoTexto}>Salvar</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  tipoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },

  tipoBotao: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#ccc',
  },

  receita: {
    backgroundColor: '#4CAF50',
  },

  despesa: {
    backgroundColor: '#F44336',
  },

  tipoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  botao: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});