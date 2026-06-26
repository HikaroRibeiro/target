import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        marginTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[300],
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.black
    },
    listContent: {
        paddingBottom: 72
    },
    empty: {
        fontSize: 14,
        fontFamily: fontFamily.regular,
        color: colors.gray[600],
        marginTop: 24
    }
});