import { Suspense } from "react";
import { Stack } from "expo-router";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { colors } from "@/theme/colors";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Loading } from "@/components/Loading";

import {SQLiteProvider} from "expo-sqlite";
import { migrate } from "@/database/migrate";

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
        <Suspense fallback={<Loading />}>
            <SQLiteProvider 
                databaseName="target.db"
                onInit={migrate}
                useSuspense
            >
                <Stack screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.white }
                }} />
            </SQLiteProvider>
        </Suspense>
    )
}