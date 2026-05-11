import { Stack } from 'expo-router';

export default function LayoutTabs() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#07101F',
        },
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}