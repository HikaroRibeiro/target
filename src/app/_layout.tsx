import { Stack } from "expo-router";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { colors } from "@/theme/colors";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Loading } from "@/components/Loading";
export default function Layout() {
    const [loaded, error] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return <Loading />;
    }

    return (
        <Stack screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.white }
        }} />
    )
}