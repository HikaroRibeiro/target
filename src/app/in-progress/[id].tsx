import { Alert, View, StatusBar } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { List } from "@/components/List";
import { Transaction, TransactionProps } from "@/components/Transaction";

import { Button } from "@/components/Button";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { useCallback, useState } from "react";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { Loading } from "@/components/Loading";
import { TransactionTypes } from "@/utils/TransactionTypes";
import dayjs from "dayjs";

 export default function InProgress() {

   const [isProcessing, setIsProcessing] = useState(true);
   const [details, setDetails] = useState({
     name: "",
     current: "R$ 0,00",
     target: "R$ 0,00",
     percentage: 0
    });
    const [transactions, setTransactions] = useState<TransactionProps[]>([]);
    
    const params = useLocalSearchParams<{ id: string }>();

    const targetDatabase = useTargetDatabase();
    const transactionsDatabase = useTransactionsDatabase();
    
  async function fetchTargetDetails(){
    try {
      const response = await targetDatabase.getTargetById(Number(params.id));
      if(response !== null) {
        setDetails({
          name: response.name,
          current: numberToCurrency(response.current),
          target: numberToCurrency(response.amount),
          percentage: Number(response.percentage.toFixed(0)),
        });
        setIsProcessing(false);
      }
    } catch (error) {
      Alert.alert("Meta", "Nao foi possivel carregar os detalhes da meta.");
      console.log(error);
    }
  }

  async function fetchTransactions() {
    try {
      const response = await transactionsDatabase.listByTargetId(Number(params.id));

      setTransactions(response.map((item) => ({
        id: String(item.id),
        value: numberToCurrency(item.amount),
        date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
        description: item.observation,
        type: item.amount > 0 ? TransactionTypes.INPUT : TransactionTypes.OUTPUT
      })));

    } catch (error) {
      Alert.alert("Meta", "Nao foi possivel carregar as transações.");
      console.log(error);
    }
  }
  async function fetchData() {

    const fetchTargetDetailsPromise = fetchTargetDetails();
    const fetchTransactionsPromise = fetchTransactions();

    await Promise.all([fetchTargetDetailsPromise, fetchTransactionsPromise]);
    setIsProcessing(false);
  }

  async function handleTransactionRemove(id: string) {
        try {
            setIsProcessing(true);
            await transactionsDatabase.remove(Number(id));
            Alert.alert("Transação", "Transação removida com sucesso!", [
                { text: "OK", onPress: () => fetchData() }
            ]);
            setIsProcessing(false);
        }catch (error) {
            Alert.alert("Meta", "Nao foi possivel remover a meta.");
            console.log(error);
        }
    }

    function transactionRemove(id: string) {
        Alert.alert("Transação", "Deseja remover a transação?", [
            { 
                text: "Sim", onPress: () => handleTransactionRemove(id) 
            },
            {
                text: "Não", style: "cancel"
            }
        ]);
    }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if(isProcessing) {
    return <Loading />
  }

  return (
    <View style={{ flex: 1, marginTop: 24, padding: 18 }}>
      <StatusBar barStyle="dark-content" />
      <PageHeader 
        title={details.name}
        rightButton={{
          icon: "edit",
          onPress: () => router.navigate(`/target?id=${params.id}`)
        }} />

        <Progress data={details} />

        <List 
          title="Transações"
          data={transactions}
          renderItem={({ item }) => <Transaction data={item} onRemove={() => transactionRemove(item.id)} />}
          keyExtractor={(item) => item.id}
          emptyMessage="Nenhuma transação cadastrada. Clique em nova transação para cadastrar!"
        />

        <Button 
          title={"Nova Transação"} 
          isProcessing={false} 
          onPress={() => router.navigate(`/transaction/${params.id}`)} />
    </View>
  );
}