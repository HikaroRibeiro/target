import { Alert, View } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";

import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/Input";
import { CurrencyInput } from "@/components/CurrencyInput";
import { TransactionType } from "@/components/TransactionType";
import { Button } from "@/components/Button";

import { TransactionTypes } from "@/utils/TransactionTypes";

export default function Transaction() {

    const parms = useLocalSearchParams<{ id: string }>();
    const transactionsDatabase = useTransactionsDatabase();

    const [type, setType] = useState(TransactionTypes.INPUT);
    const [isCreating, setIsCreating] = useState(false);
    const [amount, setAmount] = useState<number | null>(0);
    const [observation, setObservation] = useState("");

    async function handleCreate(){
        try {
            if(amount === null || amount <= 0) {
                return Alert.alert("Transação", "Informe o valor da transação.");
            }

            setIsCreating(true);
            await transactionsDatabase.create({ 
                target_id: Number(parms.id), 
                amount: type === TransactionTypes.OUTPUT ? amount * -1 : amount,
                observation });
            Alert.alert("Nova Transação", "Transação cadastrada com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);
            setIsCreating(false);

        } catch (error) {
            Alert.alert("Transação", "Nao foi possivel cadastrar a transação.");
            console.log(error)
            setIsCreating(false);
        }
    }

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <PageHeader title="Nova transação" subtitle="A cada valor guardado você fica mais próximo da sua meta." />
            <View style={{ marginTop: 32, gap: 24 }}>
                <TransactionType selected={type} onChange={setType} />
                <CurrencyInput 
                    label="Valor (R$) " 
                    value={amount}
                    onChangeValue={setAmount} />
                <Input 
                    placeholder="Ex: Investir em CDB de 110% no banco XPTO." 
                    label="Motivo (opcional)"
                    onChangeText={setObservation} 
                    />
                <Button 
                    title="Salvar"
                    onPress={() => handleCreate()} 
                    isProcessing={isCreating} />
            </View>
        </View>
    );
}