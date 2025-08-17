import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import useAuthStore from "@/store/use-auth-store";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendForgotPasswordLink } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await sendForgotPasswordLink(email);
      router.replace({
        pathname: "/",
        params: {
          message: "Password reset link sent to your email.",
        },
      });
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <SafeAreaView className="flex-1 p-4">
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold mb-8">Forgot Password</Text>

            <View className="w-full space-y-6">
              <View>
                <Text className="text-gray-600 mb-2">Email</Text>
                <TextInput
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {error ? (
                <Text className="text-red-500 text-center">{error}</Text>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className={`w-full bg-black p-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
              >
                <Text className="text-white text-center font-semibold">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Text>
              </Pressable>

              <View className="flex-row justify-center mt-4">
                <Link href="/" asChild>
                  <Pressable>
                    <Text className="text-blue-500 font-semibold">Back to Login</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
