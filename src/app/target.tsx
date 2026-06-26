import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Alert } from "react-native";
import { CurrencyInput } from "@/components/CurrencyInput";
import { useState } from "react";
import { useTargetDatabase } from "@/database/useTargetDatabase";

export default function Target() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);
    const targetDatabase = useTargetDatabase();

    const params = useLocalSearchParams<{ id: string }>();
    function handleSave() {
        if(!name.trim() || amount <= 0) {
            return Alert.alert("Meta", "Informe o nome da meta e o valor alvo.");
        }

        setIsProcessing(true);

        if(params.id) {
            setIsProcessing(false);
            router.back();
        } else {
            handleCreate();
        }
    }

    async function handleCreate() {
        try {
            await targetDatabase.create({ name, amount });
            
            Alert.alert("Nova Meta", "Nova meta cadastrada com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        }catch (error) {
            Alert.alert("Meta", "Nao foi possivel cadastrar a meta.");
        }
    }
    return (
        <View style={{ flex: 1, padding: 24}}>
            <PageHeader 
                title="Cadastrar meta" 
                subtitle="Economize para alcançar a sua meta financeira." 
            />
            <View style={{ marginTop: 32, gap: 24 }}>
                <Input 
                    placeholder="Ex: Viagem para praia, adquirir celular." 
                    label="Nome da meta"
                    value={name}
                    onChangeText={setName} 
                />
                <CurrencyInput 
                    label="Valor alvo (R$)" 
                    value={amount}
                    onChangeValue={(value: number | null) => setAmount(value ?? 0)} 
                />
                <Button 
                    title="Salvar" 
                    onPress={handleSave} 
                    isProcessing={isProcessing} 
                />
            </View>
        </View>
    );
}