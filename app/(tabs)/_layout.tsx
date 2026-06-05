// app/(tabs)/_layout.tsx
// ─────────────────────────────────────────────────────────────
// Layout das abas — define a navegação entre as telas
// Home, Add e Relatórios (Menu).
// Usamos Stack em vez de Tabs porque a navegação inferior
// foi feita manualmente no arquivo home.tsx.
// ─────────────────────────────────────────────────────────────

import { Stack } from 'expo-router';

export default function LayoutTabs() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#0F172A', // fundo escuro padrão
        },
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="add" />
      <Stack.Screen name="Menu" />
    </Stack>
  );
}
