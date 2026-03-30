import { View, Text, StyleSheet } from 'react-native';

export default function Relatorios() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Relatórios 📊</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Gastos do mês</Text>
        <Text style={styles.valor}>R$ 1.250,00</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Receitas do mês</Text>
        <Text style={styles.valor}>R$ 2.000,00</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Saldo</Text>
        <Text style={styles.valor}>R$ 750,00</Text>
      </View>

      <Text style={styles.info}>
        (provisório enquanto não tem nada)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: '#555',
  },

  valor: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },

  info: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
  },
});