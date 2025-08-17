import { getAuthStateValue } from "@/store/auth";
import { Text } from "@gluestack-ui/themed";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function Index() {
    const profile = useSelector(getAuthStateValue("profile"));

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-2xl font-bold mb-2">Welcome to Your App</Text>
                <Text className="text-gray-600 text-center">
                    Hello, {profile?.name}! This is your new template app. Start building something amazing!
                </Text>
            </View>
        </SafeAreaView>
    );
}