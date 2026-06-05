// app/_layout.tsx
// ─────────────────────────────────────────────────────────────
// Layout raiz do app — define as rotas principais.
// Todas as telas do app passam por aqui.
// ─────────────────────────────────────────────────────────────

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tela de Login (app/index.tsx) */}
      <Stack.Screen name="index" />

      {/* Tela de Cadastro (app/cadastro.tsx) */}
      <Stack.Screen name="cadastro" />

      {/* Pasta das abas principais (app/(tabs)/) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
