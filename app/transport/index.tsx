import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import GeneralPage from "@/app/components/GeneralPage";
import {TransportMap} from "@/app/components/map";
import ApiService from "@/app/services/api/apiService";
import {getScmToken} from "@/app/services/storage/tokenStorage";

export type TransportMapPointType = {
    title: string;
    lat: number;
    lng: number;
};

export default function Transport() {
    const [transportMapPoints, setTransportMapPoints] = useState<TransportMapPointType[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchTransportMapPoints = async () => {
            try {
                const token = await getScmToken();

                if (!token) {
                    return;
                }

                const response = await ApiService.get<TransportMapPointType[]>("/transport/location", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!isMounted) {
                    return;
                }

                console.log('Driver locations - ', response.data)

                setTransportMapPoints(response.data);
            } catch (error) {
                console.error("Error fetching transport map points:", error);
            }
        };

        void fetchTransportMapPoints();

        const intervalId = setInterval(() => {
            void fetchTransportMapPoints();
        }, 30000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    return (
        <GeneralPage
            showUserHeader={false}
            shareLocation={true}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.infoContainer}>
                    <TransportMap
                        points={transportMapPoints}
                    />
                </View>
            </ScrollView>
        </GeneralPage>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 5,
        backgroundColor: "#F5F7FA",
    },

    infoContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 5,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E5E5E5",
    },

    noPermissionText: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        paddingVertical: 20,
    },

    webView: {
        flex: 1,
        backgroundColor: "#f5f7fa",
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.65)",
    },

    errorContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#fef2f2",
        borderWidth: 1,
        borderColor: "#fecaca",
    },

    errorText: {
        color: "#b91c1c",
        fontSize: 14,
        textAlign: "center",
        fontWeight: "500",
    },
});
