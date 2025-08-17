import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import useAuthStore from "@/store/use-auth-store";

export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp(name, email, password);
      router.replace({
        pathname: "/",
        params: {
          message: "Account created successfully. Please check your email for verification.",
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
            <Text className="text-2xl font-bold mb-8">Create Account</Text>

            <View className="w-full space-y-6">
              <View>
                <Text className="text-gray-600 mb-2">Name</Text>
                <TextInput
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

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

              <View>
                <Text className="text-gray-600 mb-2">Password</Text>
                <TextInput
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View>
                <Text className="text-gray-600 mb-2">Confirm Password</Text>
                <TextInput
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
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
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </Pressable>

              <View className="flex-row justify-center mt-4">
                <Text className="text-gray-600">Already have an account? </Text>
                <Link href="/" asChild>
                  <Pressable>
                    <Text className="text-blue-500 font-semibold">Sign In</Text>
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
