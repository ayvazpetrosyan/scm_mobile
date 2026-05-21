import GeneralPage from "@/app/components/GeneralPage";
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function Journal() {
    return (
        <GeneralPage title={'Journal'}>
            <SafeAreaProvider>

            </SafeAreaProvider>
        </GeneralPage>
    )
}
