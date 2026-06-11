import { View, Text, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function Transaction() {
    const parms = useLocalSearchParams<{ id: string }>();
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Transaction {parms.id}</Text>
            <Button title="Voltar" onPress={() => router.back()} />
        </View>
    );
}