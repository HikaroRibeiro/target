
import { HomeHeader, HomeHeaderProps } from "@/components/HomeHeader";
import { View, StatusBar, Alert } from "react-native";
import { Target, TargetProps } from "@/components/Target";
import { List } from "@/components/List";
import { Button } from "@/components/Button";
import { router, useFocusEffect } from "expo-router";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useCallback, useState } from "react";
import { Loading } from "@/components/Loading";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";

/*
    const summary = {
        total: "R$ 2.680,00",
        input: { title: "Entradas", amount: "R$ 1.000,00" },
        output: { title: "Saídas", amount: "-R$ 501,00" },
    }
*/

export default function Index() {

    const targetDatabase = useTargetDatabase();
    const transactionsDatabase = useTransactionsDatabase();

    const [summary, setSummary] = useState<HomeHeaderProps>();
    const [isFetching, setIsFetching] = useState(true);
    const [targets, setTargets] = useState<TargetProps[]>([]);

    async function fetchTargets() {
        try{
            const response = await targetDatabase.listByClosestTarget();
            return response.map((item) => ({
                id: String(item.id),
                name: item.name,
                target: numberToCurrency(item.amount),
                current: numberToCurrency(item.current),
                percentage: item.percentage.toFixed(0) + "%",
            }))
        }catch (error) {
            Alert.alert("Meta", "Nao foi possivel cadastrar a meta.");
            console.log(error);
        }
    }

    async function fetchSummary(): Promise<HomeHeaderProps | undefined> {
        try{
            const response: { total: string, input: number, output: number } | any = await transactionsDatabase.summary();
            return {
                total: numberToCurrency(response.input + response.output),
                input: { title: "Entradas", amount: numberToCurrency(response.input) },
                output: { title: "Saídas", amount: numberToCurrency(response.output) },
            }
        }catch (error) {
            Alert.alert("Meta Erro!", "Nao foi possivel carregar o resumo.");
            console.log(error);
        }
        
    }

    async function fetchData() {
        const targetDataPromise = fetchTargets();
        const dataSummaryPromise = fetchSummary();

        const [targetData, summaryData] = await Promise.all([
            targetDataPromise, 
            dataSummaryPromise
        ]);
        setTargets(targetData ?? []);
        setSummary(summaryData);

        setIsFetching(false);
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();
        },[])
    )

    if(isFetching) {
        return <Loading />;
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <HomeHeader data={summary ?? { total: "R$ 0,00", input: { title: "Entradas", amount: "R$ 0,00" }, output: { title: "Saídas", amount: "R$ 0,00" } }} />
            <List title="Minhas metas" 
                data={targets}
                keyExtractor={(item) => item.id || 'default-key'} 
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