
import { HomeHeader } from "@/components/HomeHeader";
import { View, Text, Button } from "react-native";
import { Target } from "@/components/Target";

const summary = {
    total: "R$ 2.680,00",
    input: { title: "Entradas", amount: "R$ 1.000,00" },
    output: { title: "Saídas", amount: "-R$ 501,00" },
}

const targets = [
    { 
        name: "Comprar uma cadeira ergonômica", 
        percentage: "100%", 
        current: "R$ 1.000,00", 
        target: "R$ 1.000,00"
    }, 
    { 
        name: "Pagar conta de luz", 
        percentage: "100%", 
        current: "R$ 1.000,00", 
        target: "R$ 1.000,00"
    }
]

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <HomeHeader data={summary} />
            <Target data={targets[0]} />
            <Target data={targets[1]} />
        </View>
    );
}