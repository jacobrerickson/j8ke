import { Tabs, useRouter } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { getAuthStateValue } from "@/store/auth";
import { useEffect } from "react";

export default function TabLayout() {
    const router = useRouter();
    const profile = useSelector(getAuthStateValue("profile"));

    useEffect(() => {
        if (!profile) {
            router.replace("/");
        }
    }, [profile]);

    return (
        <Tabs screenOptions={{
            headerShown: false
        }}>
            <Tabs.Screen name="home" options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color }) => <AntDesign name="home" size={28} color={color} />,
            }} />
            <Tabs.Screen name="messages" options={{
                tabBarLabel: "Messages",
                tabBarIcon: ({ color }) => <AntDesign name="message1" size={28} color={color} />,
            }} />
            <Tabs.Screen name="profile" options={{
                tabBarLabel: "Profile",
                tabBarIcon: ({ color }) => <AntDesign name="user" size={28} color={color} />,
            }} />
        </Tabs>
    );
} 