import GeneralPage from "@/app/components/GeneralPage";
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function Absent() {
    return (
        <GeneralPage title={'Absent'}>
            <SafeAreaProvider>

            </SafeAreaProvider>
        </GeneralPage>
    )
}
