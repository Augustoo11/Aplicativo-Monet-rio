import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: '#3b82f6', }}>
      <Tabs.Screen
      name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => 
          <FontAwesome5 name="home" color={color} size={20} />}}>
      </Tabs.Screen>

      <Tabs.Screen 
        name="add"
        options={{ title: '', tabBarIcon: ({ color }) => (
        <FontAwesome5 name="plus" size={24} color={color} /> ),
        tabBarItemStyle: { marginHorizontal: 20,}
      }}/>

      <Tabs.Screen
        name="Menu"
        options={{
        tabBarIcon: ({ color }) => <Feather name="menu" color={color} size={20} /> }}
      ></Tabs.Screen>

    </Tabs>
  );
}