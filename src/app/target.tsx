import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Alert, StatusBar } from "react-native";
import { CurrencyInput } from "@/components/CurrencyInput";
import { useEffect, useState } from "react";
import { useTargetDatabase } from "@/database/useTargetDatabase";

export default function Target() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);
    const targetDatabase = useTargetDatabase();

    const params = useLocalSearchParams<{ id: string }>();
    function save() {
        if(!name.trim() || amount <= 0) {
            return Alert.alert("Meta", "Informe o nome da meta e o valor alvo.");
        }

        setIsProcessing(true);

        if(params.id) {
            update();
            setIsProcessing(false);
        } else {
            create();
        }
    }

    async function update() {
        try {
            await targetDatabase.update({ name, amount, id: Number(params.id) });
            Alert.alert("Meta", "Meta atualizada com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        }catch (error) {
            Alert.alert("Meta", "Nao foi possivel atualizar a meta.");
            setIsProcessing(false);
        }
    }
    async function create() {
        try {
            await targetDatabase.create({ name, amount });
            
            Alert.alert("Nova Meta", "Nova meta cadastrada com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        }catch (error) {
            Alert.alert("Meta", "Nao foi possivel cadastrar a meta.");
        }
    }

    async function fetchDetails(id: number) {
        try{
            const response = await targetDatabase.getTargetById(id);
            if(response !== null) {
                setName(response.name);
                setAmount(response.amount);
            }
        }catch (error) {
        if(error instanceof Error) {
            Alert.alert("Meta", "Nao foi possivel carregar os detalhes da meta.");
        }
        }
    }

    async function handleRemove(id: number) {
        try {
            setIsProcessing(true);
            await targetDatabase.remove(id);
            Alert.alert("Meta", "Meta removida com sucesso!", [
                { text: "OK", onPress: () => router.replace("/") }
            ]);
            setIsProcessing(false);
        }catch (error) {
            Alert.alert("Meta", "Nao foi possivel remover a meta.");
            console.log(error);
        }
    }

    function remove() {
        Alert.alert("Meta", "Deseja remover a meta?", [
            { 
                text: "Sim", onPress: () => handleRemove(Number(params.id)) 
            },
            {
                text: "Cancelar", style: "cancel"
            }
        ]);
    }

    useEffect(() => {
        if(params.id) {
            fetchDetails(Number(params.id));
        }
    }, [params.id]);

    return (
        <View style={{ flex: 1, padding: 24}}>
            <StatusBar barStyle="dark-content" />
            <PageHeader 
                title="Meta" 
                subtitle="Economize para alcançar a sua meta financeira."
                rightButton={params.id ? {
                    icon: "delete", onPress: () => remove()} : undefined}
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
                    onPress={save} 
                    isProcessing={isProcessing} 
                />
            </View>
        </View>
    );
}