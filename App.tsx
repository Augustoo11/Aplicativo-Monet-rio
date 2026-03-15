import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';

const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 768;

export default function App() {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>

      {/* Lado roxo */}
      <View style={styles.left}>

        <Text style={styles.title}>
          Transforme economia em <Text style={styles.highlight}>conquista.</Text>
        </Text>

        <Text style={styles.description}>
          Diga adeus às planilhas chatas e veja suas metas ganharem vida.
        </Text>

        <View style={styles.progressCard}>

          <View style={styles.iconRow}>
            <Text style={styles.icon}>                                     🏃‍➡️</Text>
            <Text style={styles.icon}>💰</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={styles.progress}></View>
          </View>

          <Text style={styles.progressText}>
            Com Paywise você está a um passo do seu sonho.
          </Text>

        </View>

      </View>

      {/* Lado login */}
      <View style={styles.right}>

        <Text style={styles.loginTitle}>Bem-vindo de volta!</Text>
        <Text style={styles.subtitle}>Acesse seu painel financeiro</Text>

        <TextInput
          placeholder="seu@email.com"
          style={styles.input}
        />

        {/* senha */}
        <View style={{position:'relative'}}>
          <TextInput
            placeholder="**"
            secureTextEntry={!showPassword}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{position:'absolute', right:10, top:12}}
          >
            <View>
              <Text style={{fontSize:18}}>👁</Text>
              {!showPassword && (
                <View style={{
                  position:'absolute',
                  width:20,
                  height:2,
                  backgroundColor:'#000',
                  top:10,
                  transform:[{rotate:'45deg'}]
                }}/>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar na Jornada</Text>
        </TouchableOpacity>
      

        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: 'bold',color: '#6A5AE0',marginTop : 10 }}>
  Esqueci minha senha
</Text>

        <Text style={styles.register}>
          Não tem uma conta? <Text style={styles.link}>Criar Perfil Financeiro</Text>
        </Text>

      </View>

      <StatusBar style="auto" />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: isMobile ? 'column' : 'row'
  },

  left: {
    flex: 1,
    backgroundColor: '#6A5AE0',
    padding: isMobile ? 25 : 30,
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: isMobile ? 0 : 8,
      height: isMobile ? 6 : 0
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12
  },

  title: {
    fontSize: isMobile ? 26 : 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15
  },

  highlight: {
    color: '#FFC107'
  },

  description: {
    color: '#ddd',
    marginBottom: 30,
    fontSize: isMobile ? 14 : 16
  },

  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 20,
    borderRadius: 15
  },

  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2
  },

  icon: {
    fontSize: 20
  },

  progressBar: {
    height: 9,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10
  },

  progress: {
    width: '65%',
    height: '100%',
    backgroundColor: '#FFC107'
  },

  progressText: {
    color: '#eee',
    fontSize: 12
  },

  right: {
    flex: 1,
    padding: isMobile ? 25 : 30,
    textAlign: 'center'
  },

  loginTitle: {
    fontSize: isMobile ? 22 : 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },

  subtitle: {
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15
  },

  button: {
    backgroundColor: '#6A5AE0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },

  register: {
    marginTop: 15,
    fontSize: 13,
    textAlign: 'center'
  },

  link: {
    color: '#6A5AE0',
    fontWeight: 'bold',
    textAlign: 'center'
  }

});
