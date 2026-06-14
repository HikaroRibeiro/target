
import { HomeHeader } from "@/components/HomeHeader";
import { router } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <HomeHeader data={{ total: "R$ 2.680,00" }} />
        </View>
    );
}