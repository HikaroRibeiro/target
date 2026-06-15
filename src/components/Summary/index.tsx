import { View, Text } from "react-native";
import { styles } from "./styles";

export function Summary() {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Summary</Text>
        </View>
    );
}