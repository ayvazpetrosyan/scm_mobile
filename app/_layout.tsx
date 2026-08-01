import { Stack } from 'expo-router';
import { useEffect } from "react";
import {startDriverLocationTrackingIfAllowed} from "@/app/services/location/locationService";

export default function RootLayout() {
    useEffect(() => {
        const startLocationTracking = async () => {
            try {
                await startDriverLocationTrackingIfAllowed();
            } catch (error) {
                console.error("Error starting driver location tracking:", error);
            }
        };

        void startLocationTracking();
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}
