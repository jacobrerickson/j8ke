import { getAuthStateValue } from "@/store/auth";
import useAuthStore from "@/store/use-auth-store";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function Index() {
    const profile = useSelector(getAuthStateValue("profile"));
    const { signOut } = useAuthStore();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-2xl font-bold mb-4">
                    Welcome, {profile?.name}!
                </Text>
                <Pressable
                    onPress={signOut}
                    className="bg-blue-500 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Sign Out</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}