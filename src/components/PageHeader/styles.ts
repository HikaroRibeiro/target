import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingTop: 32,
    },
    title: {
        fontSize: 24,
        color: colors.black,
        fontFamily: fontFamily.bold,
        marginBottom: 7
    },
    subtitle: {
        fontSize: 14,
        color: colors.gray[500],
        fontFamily: fontFamily.regular
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32
    }
})