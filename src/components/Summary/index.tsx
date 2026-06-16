import { View, Text, ColorValue } from "react-native";
import { styles } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";

export type SummaryProps = {
    title: string;
    amount: string;
}

type Props = {
    data: SummaryProps;
    icon: {
        name: keyof typeof MaterialIcons.glyphMap;
        color: ColorValue;
    }
    isLeft?: boolean;
}

export function Summary({ data, icon, isLeft = false }: Props) {
    
    return (
        <View style={styles.container}>
            <View style={[styles.header, isLeft && { justifyContent: 'flex-end' }]}>
                <MaterialIcons name={icon.name} size={16} color={icon.color} />
                <Text style={styles.value}>{data.title}</Text>
            </View>
            <Text style={styles.label}>{data.amount}</Text>
        </View>
    );
}