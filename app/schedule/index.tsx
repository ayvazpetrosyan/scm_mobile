import GeneralPage from "@/app/components/GeneralPage";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Schedule() {
    return (
        <>
            <Stack.Screen options={{ title: "Schedule" }} />

            <GeneralPage >
                <SafeAreaProvider>

                </SafeAreaProvider>
            </GeneralPage>
        </>
    );
}
