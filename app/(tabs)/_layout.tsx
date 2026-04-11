import { Tabs } from 'expo-router';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B1426' }}> 
      <Tabs
        screenOptions={{
          headerShown: false, // OBRIGATÓRIO: Se estiver true, fica branco em cima
          tabBarActiveTintColor: '#3b82f6',
          // No Expo Router, às vezes o estilo do container é passado aqui:
          contentStyle: { backgroundColor: 'transparent' }, 
          tabBarStyle: {
            backgroundColor: '#0B1426', 
            borderTopWidth: 0,
          },
        } as any} // O 'as any' força o reconhecimento se o TS reclamar
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Início',
            tabBarIcon: ({ color }) => <FontAwesome5 name="home" color={color} size={20} />,
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarIcon: ({ color }) => <FontAwesome5 name="plus" size={24} color={color} />,
            tabBarItemStyle: { marginHorizontal: 20 },
          }}
        />

        <Tabs.Screen
          name="Menu"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => <Feather name="menu" color={color} size={20} />,
          }}
        />
      </Tabs>
    </View>
  );
}