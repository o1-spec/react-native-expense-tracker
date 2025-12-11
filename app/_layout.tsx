import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Google Fonts
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

// ---------- Navigation Guard ----------
function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login';
    const inTabsGroup = segments[0] === '(tabs)';
    
    if (user && inAuthGroup) {
      router.replace('/(tabs)');
      return;
    }
    if (!user && inTabsGroup) {
      router.replace('/login');
      return;
    }

  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal',
          headerShown: true,
          title: 'Add Expense',
        }} 
      />
    </Stack>
  );
}

// ---------- Root Layout ----------
export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    InterRegular: Inter_400Regular,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ExpenseProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutNav />
            <StatusBar style="dark" />
          </ThemeProvider>
        </ExpenseProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
