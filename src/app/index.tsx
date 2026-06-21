
import { HomeHeader } from "@/components/HomeHeader";
import { View, StatusBar } from "react-native";
import { Target } from "@/components/Target";
import { List } from "@/components/List";
import { Button } from "@/components/Button";
import { router } from "expo-router";

const summary = {
    total: "R$ 2.680,00",
    input: { title: "Entradas", amount: "R$ 1.000,00" },
    output: { title: "Saídas", amount: "-R$ 501,00" },
}

const targets = [
    { 
        id: "1",
        name: "Comprar uma cadeira ergonômica", 
        percentage: "100%", 
        current: "R$ 1.000,00", 
        target: "R$ 1.000,00"
    }, 
    {
        id: "2",
        name: "Pagar conta de luz", 
        percentage: "100%", 
        current: "R$ 1.000,00", 
        target: "R$ 1.000,00"
    },
    {
        id: "3",
        name: "Pagar conta de água", 
        percentage: "100%", 
        current: "R$ 1.000,00", 
        target: "R$ 1.000,00"
    }
]

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <HomeHeader data={summary} />
            <List title="Minhas metas" 
                data={targets}
                keyExtractor={(item) => item.id} 
                renderItem={({ item }) => <Target data={item} onPress={() => router.navigate(`/in-progress/${item.id}`)} />}
                emptyMessage="Nenhuma meta cadastrada. Clique em nova meta para cadastrar!"
                containerStyle={{ paddingHorizontal: 24 }}
            />
            <View style={{ padding: 24, paddingBottom: 32}}>
                <Button title={"Nova Meta"} isProcessing={false} onPress={() => router.navigate("/target")} />
            </View>
        </View>
    );
}