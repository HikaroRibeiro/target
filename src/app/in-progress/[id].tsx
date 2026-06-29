import { Alert, View } from "react-native";
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

/* const transactions = [{
  id: "1",
  value: "R$ 1.580,00",
  date: "01/01/2023",
  description: "Investimentos em Renda Fixa",
  type: TransactionTypes.INPUT
}, 
{
  id: "2",
  value: "R$ 580,00",
  date: "01/01/2023",
  description: "Compra de Apple Watch",
  type: TransactionTypes.OUTPUT
}]
  */

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
        date: String(item.created_at),
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
          renderItem={({ item }) => <Transaction data={item} onRemove={() => {}} />}
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