import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import {getToken, removeToken} from "@/app/services/tokenStorage";
import API from "@/app/services/api";
import GeneralPage from "@/app/components/GeneralPage";
import {useTranslation} from "react-i18next";

type User = {
    name: string;
    email: string;
    phone?: string;
    photo?: string;
};

export default function AccountPage() {
    const router = useRouter();
    const {t} = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await getToken();

                if (!token) {
                    router.replace("/login");
                    return;
                }

                const response = await API.get("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch {
                Alert.alert("Error", "Unable to load user information.");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        void fetchUser();
    }, [router]);

    const handleLogout = async () => {
        try {
            await removeToken();
            router.replace("/login");
        } catch {
            Alert.alert("Error", "Unable to remove token.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <GeneralPage showUserHeader={false} showLanguageSwitcher={true}>
            <ScrollView contentContainerStyle={styles.container}>
                <Image
                    source={{
                        uri: user.photo || "https://via.placeholder.com/100",
                    }}
                    style={styles.profileImage}
                />

                <View style={styles.infoContainer}>
                    <InfoRow icon="person" label={t('Name')} value={user.name} />
                    <InfoRow icon="email" label={t('Email')} value={user.email} />
                    <InfoRow icon="phone" label={t('Phone')} value={user.phone || "-"} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Icon name="logout" size={20} color="#fff" />
                        <Text style={styles.buttonText}>{t('Logout')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </GeneralPage>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: string;
    label: string;
    value: string;
}) {
    return (
        <View style={styles.infoRow}>
            <Icon name={icon} size={22} color="#555" style={{ width: 28 }} />
            <View>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
    },
    container: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f9f9f9",
        flexGrow: 1,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    infoContainer: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 2,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    label: {
        fontSize: 14,
        color: "#888",
    },
    value: {
        fontSize: 16,
        color: "#000",
        fontWeight: "500",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F44336",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 5,
    },
});
