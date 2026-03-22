import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: true,             // Mostra o título no topo
      tabBarActiveTintColor: '#3b82f6', // Cor do ícone quando selecionado
    }}>
      <Tabs.Screen
        name="home" // Esse nome tem que ser igual ao arquivo da tela
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}