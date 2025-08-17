import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import store from "@/store";
import { getAuthStateValue } from "@/store/auth";
import useAuthStore from "@/store/use-auth-store";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";


export default function RootLayout() {
  return (
    <Provider store={store}>
      <GluestackUIProvider
        mode="light">
        <Auth />
      </GluestackUIProvider>
    </Provider>
  );
}

export function Auth() {
  const profile = useSelector(getAuthStateValue("profile"))
  const { init } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (profile) {
      router.replace("/(tabs)/home")
    }
  }, [profile])

  return (

    <Stack screenOptions={{
      headerShown: false,
      animation: 'fade',
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="enter-code" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
    </Stack>
  );
}
