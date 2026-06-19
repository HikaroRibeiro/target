import { TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicatorBase, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { colors } from "@/theme";

type Props = TouchableOpacityProps & {
    title: string;
    isProcessing: boolean
}


export function Button({ title, isProcessing = false, ...rest }: Props) {
    return (
        <TouchableOpacity 
            disabled={isProcessing}
            activeOpacity={0.8} 
            style={styles.container} {...rest}>
            <Text style={styles.title}>{isProcessing ? (<ActivityIndicator size="small" color={colors.white} />) : (title)}</Text>
        </TouchableOpacity>
    );
}