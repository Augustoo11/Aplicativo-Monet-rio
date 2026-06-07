// app/(tabs)/_layout.tsx
// ─────────────────────────────────────────────────────────────
// Layout das abas — define as telas disponíveis no app.
// ✅ NOVO: adicionadas as telas Configuracoes e Metas.
// ─────────────────────────────────────────────────────────────

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
