import { Stack } from 'expo-router';

export default function LayoutTabs() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#0F172A',
        },
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="add" />
      <Stack.Screen name="Menu" />
      {/* ✅ NOVAS TELAS */}
      <Stack.Screen name="Configuracoes" />
      <Stack.Screen name="Metas" />
    </Stack>
  );
}
