import { View, Text } from 'react-native';

export default function TelaHome() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Dashboard GESTORFIN</Text>
      <Text>Você entrou com sucesso!</Text>
    </View>
  );
}