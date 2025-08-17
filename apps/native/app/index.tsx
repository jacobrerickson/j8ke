import {
  Button,
  ButtonSpinner,
  ButtonText
} from "@/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Link, LinkText } from "@/components/ui/link";
import useAuthStore from "@/store/use-auth-store";
import { Storage } from "@/utils/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";


export default function Index() {
  const messageParam = useLocalSearchParams<{ message: string }>()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(messageParam.message || "");
  const [rememberme, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, sendEmailVerification } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async () => {
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await signIn(email, password, rememberme);
      router.push({
        pathname: "/enter-code",
        params: {
          email,
        },
      });
    } catch (e) {
      setError((e as Error).message)
      setLoading(false)
    }
  };

  useEffect(() => {
    const init = async () => {
      const email = await Storage.get(Storage.keys.EMAIL);
      const password = await Storage.get(Storage.keys.PASSWORD);
      setEmail(email || "");
      setPassword(password || "");
    };
    init();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center'
        }}
      >
        <View className="mx-auto flex flex-col gap-6 px-6 items-center w-full">
          <Text className="mt-2 text-[40px] font-bold">Log in</Text>
          <Text className="text-center text-gray-500">
            Login to start using the app
          </Text>
          <View className="flex flex-col items-center gap-1">
            {message && (
              <Text className="mt-2 text-lg font-bold text-green-500">{message}</Text>
            )}
            {error && (
              <Text className="mt-2 text-lg font-bold text-red-500">{error}</Text>
            )}
            {error && error.includes("verify your email") && (
              <Link onPress={(() => {
                sendEmailVerification(email);
                setMessage("Verification email sent");
                setError("");
              })}>
                <LinkText className="font-medium text-primary-700 group-hover/link:text-primary-600 text-md">
                  Resend Email
                </LinkText>
              </Link>
            )}
          </View>
          <View className="flex flex-col w-full gap-1">
            <Text className="mr-auto font-bold text-[20px]">Email</Text>
            <Input>
              <InputField
                value={email}
                onChange={(v) => setEmail(v.nativeEvent.text)}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>
          </View>
          <View className="flex flex-col w-full gap-1">
            <Text className="mr-auto font-bold text-[20px]">Password</Text>
            <Input>
              <InputField
                secureTextEntry
                value={password}
                onChange={(v) => setPassword(v.nativeEvent.text)}
                placeholder="Password"
              />
            </Input>
          </View>
          <View className="flex flex-row w-full items-center justify-between">
            <Checkbox
              size="sm"
              value="Remember me"
              isChecked={rememberme}
              onChange={(v) => setRememberMe(v.valueOf())}
              aria-label="Remember me"
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel className="text-md">Remember me</CheckboxLabel>
            </Checkbox>
            <Link onPress={() => router.push("/forgot-password")}>
              <LinkText className="font-medium text-primary-700 group-hover/link:text-primary-600 text-md">
                Forgot Password?
              </LinkText>
            </Link>
          </View>
          <Button className={`w-full text-white ${loading && 'opacity-90'}`} disabled={loading} onPress={handleSubmit}>
            {loading && (
              <ButtonSpinner />
            )}
            <ButtonText>Sign in</ButtonText>
          </Button>
          <View className="flex flex-row w-full items-center gap-2 justify-center">
            <Text className="text-md">Don't have an account?</Text>
            <Link onPress={() => router.push("/sign-up")}>
              <LinkText
                className="font-medium text-primary-700 group-hover/link:text-primary-600  group-hover/pressed:text-primary-700"
                size="md"
              >
                Sign up
              </LinkText>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
