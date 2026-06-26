import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/Input";
import { CurrencyInput } from "@/components/CurrencyInput";
import { TransactionType } from "@/components/TransactionType";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { useState } from "react";
import { Button } from "@/components/Button";

export default function Transaction() {
    const parms = useLocalSearchParams<{ id: string }>();
    const [type, setType] = useState(TransactionTypes.INPUT);

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <PageHeader title="Nova transação" subtitle="A cada valor guardado você fica mais próximo da sua meta." />
            <View style={{ marginTop: 32, gap: 24 }}>
                <TransactionType selected={type} onChange={setType} />
                <CurrencyInput 
                    label="Valor (R$) " 
                    value={0} />
                <Input 
                    placeholder="Ex: Investir em CDB de 110% no banco XPTO." 
                    label="Motivo (opcional)" />
                <Button 
                    title="Salvar"
                    onPress={() => router.back()} 
                    isProcessing={false} />
            </View>
        </View>
    );
}