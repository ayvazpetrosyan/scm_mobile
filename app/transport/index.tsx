import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import GeneralPage from "@/app/components/GeneralPage";
import type { User } from "@/app/types/user";
import { getScmUser } from "@/app/services/storage/userStorage";
import {TransportMap} from "@/app/components/map";

export type TransportMapPoint = {
    title: string;
    lat: number;
    lng: number;
};

const defaultMarkedPoints: TransportMapPoint[] = [
    {
        title: "Test point",
        lat: 40.1872,
        lng: 44.5152,
    },
];

function InfoRow({
                     icon,
                     label,
                     value,
                 }: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    value?: string | null;
}) {
    return (
        <View style={styles.row}>
            <MaterialCommunityIcons
                name={icon}
                size={24}
                color="#1976D2"
                style={styles.icon}
            />

            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>
                    {value && value.trim() !== "" ? value : "-"}
                </Text>
            </View>
        </View>
    );
}

export default function Transport() {
    const [user, setUser] = useState<User | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchUser = async () => {
            const userFromStorage = await getScmUser();

            if (typeof userFromStorage !== "string") {
                return;
            }

            const parsedUser: User = JSON.parse(userFromStorage);
            setUser(parsedUser);
        };

        void fetchUser();
    }, []);

    const hasShareLocationPermission =
        user?.permissions?.some(
            (p) =>
                p.controller === "Transport" &&
                p.action === "shareLocation"
        ) ?? false;

    return (
        <GeneralPage
            showUserHeader={false}
        >
            <ScrollView contentContainerStyle={styles.container}>
                {hasShareLocationPermission ? (
                    <View style={styles.infoContainer}>
                        <InfoRow
                            icon="account"
                            label={t("Name")}
                            value={user?.name}
                        />

                        <InfoRow
                            icon="map-marker"
                            label={t("Vehicle title on map")}
                            value={user?.vehicleTitleOnMap}
                        />

                        <InfoRow
                            icon="routes"
                            label={t("Transport line number")}
                            value={user?.vehicleLineName}
                        />

                        <InfoRow
                            icon="card-text"
                            label={t("Vehicle registration number")}
                            value={user?.vehicleRegistrationNumber}
                        />

                        <InfoRow
                            icon="bus"
                            label={t("Vehicle name")}
                            value={user?.vehicleDescription}
                        />

                        <InfoRow
                            icon="text-box-outline"
                            label={t("Vehicle description")}
                            value={user?.vehicleInfo}
                        />
                    </View>
                ) : (
                    <View style={styles.infoContainer}>
                        <TransportMap
                            points={defaultMarkedPoints}
                        />
                    </View>
                )}
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

    icon: {
        width: 30,
    },

    textContainer: {
        flex: 1,
        marginLeft: 12,
    },

    label: {
        fontSize: 13,
        color: "#777",
        marginBottom: 3,
    },

    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
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
