import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-2xl font-bold">Messages</Text>
                <Text className="text-gray-600 text-center mt-2">
                    Your messages will appear here
                </Text>
            </View>
        </SafeAreaView>
    );
}