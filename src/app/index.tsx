
import { router } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Index() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
            <Text>Olá React Router!</Text>
            <Button title="Nova meta" onPress={() => {router.navigate("/target")}} />
            <Button title="Transação" onPress={() => {router.navigate("/transaction/513")}} />
            <Button title="In Progress" onPress={() => {router.navigate("/in-progress/123456789")}} />
        </View>
    );
}