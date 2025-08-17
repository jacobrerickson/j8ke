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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function Index() {
  const { email } = useLocalSearchParams<{ email: string }>()
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyEmailCode } = useAuthStore()
  const router = useRouter()
  const handleSubmit = async (code: string) => {
    setError("");
    setLoading(true);
    try {
      await verifyEmailCode(email, code);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View className="mx-auto flex flex-col gap-6 px-6 items-center w-full">
        <Text className="mt-2 text-[40px] font-bold">Enter code</Text>
        <Text className="text-center text-gray-500">
          Enter the 5 digit code that was sent to {email}
        </Text>
        {error ? (
          <Text className="mt-2 text-lg font-bold text-red-500">{error}</Text>
        ) : null}
        <View className="w-[300px]">
          <OtpInput numberOfDigits={5} onFilled={handleSubmit} />
        </View>
        <Button className={`w-full text-white ${loading && 'opacity-90'}`} disabled={loading} onPress={() => handleSubmit("12345")}>
          {loading && (
            <ButtonSpinner />
          )}
          <ButtonText>Submit</ButtonText>
        </Button>
        <View className="flex flex-row w-full items-center gap-2 justify-center">
          <Text className="text-md">Sign into a different account?</Text>
          <Link onPress={() => router.push("/")}>
            <LinkText
              className="font-medium text-primary-700 group-hover/link:text-primary-600  group-hover/pressed:text-primary-700"
              size="md"
            >
              Log in
            </LinkText>
          </Link>
        </View>
      </View>
    </View>
  );
}
