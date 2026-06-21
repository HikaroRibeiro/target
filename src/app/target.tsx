import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { CurrencyInput } from "@/components/CurrencyInput";

export default function Target() {
    return (
        <View style={{ flex: 1, padding: 24}}>
            <PageHeader 
                title="Cadastrar meta" 
                subtitle="Economize para alcançar a sua meta financeira." 
            />
            <View style={{ marginTop: 32, gap: 24 }}>
                <Input placeholder="Ex: Viagem para praia, adquirir celular." label="Nome da meta" />
                <CurrencyInput label="Valor alvo" value={1350.75} />
                <Button title="Salvar" onPress={() => router.back()} isProcessing={false} />
            </View>
        </View>
    );
}