import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* "index" refere-se ao arquivo app/index.tsx (seu Login) */}
      <Stack.Screen name="index" /> 
      {/* "(tabs)" refere-se à pasta das abas */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}