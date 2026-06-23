import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { List } from "@/components/List";
import { Transaction } from "@/components/Transaction";
import { TransactionType } from "@/utils/TransactionTypes";
import { Button } from "@/components/Button";

const details = {
  current: "R$ 580,00",
  target: "R$ 1.790,00",
  percentage: 25
}

const transactions = [{
  id: "1",
  value: "R$ 1.580,00",
  date: "01/01/2023",
  description: "Investimentos em Renda Fixa",
  type: TransactionType.INPUT
}, 
{
  id: "2",
  value: "R$ 580,00",
  date: "01/01/2023",
  description: "Compra de Apple Watch",
  type: TransactionType.OUTPUT
}]
export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, marginTop: 24, padding: 18 }}>
      <PageHeader 
        title="Apple Watch"
        rightButton={{
          icon: "edit",
          onPress: () => {}
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