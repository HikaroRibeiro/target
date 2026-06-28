import { Alert, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { List } from "@/components/List";
import { Transaction } from "@/components/Transaction";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { Button } from "@/components/Button";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useCallback, useState } from "react";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { Loading } from "@/components/Loading";

const transactions = [{
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
export default function InProgress() {

  const [isProcessing, setIsProcessing] = useState(true);
  const [details, setDetails] = useState({
    name: "",
    current: "R$ 0,00",
    target: "R$ 0,00",
    percentage: 0
  });

  const params = useLocalSearchParams<{ id: string }>();
  const targetDatabase = useTargetDatabase();
  
  async function fetchDetails(){
    try {
      const response = await targetDatabase.getTargetById(Number(params.id));
      if(response !== null) {
        setDetails({
          name: response.name,
          current: numberToCurrency(response.current),
          target: numberToCurrency(response.amount),
          percentage: response.percentage
        });
        setIsProcessing(false);
      }
    } catch (error) {
      Alert.alert("Meta", "Nao foi possivel carregar os detalhes da meta.");
      console.log(error);
    }
  }

  async function fetchData() {
    const fetchDetailsPromise = fetchDetails();
    await Promise.all([fetchDetailsPromise]);
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