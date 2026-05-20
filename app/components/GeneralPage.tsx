import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
    StyleProp,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import Icon from "react-native-vector-icons/MaterialIcons";

type User = {
    name: string;
    email: string;
    phone?: string;
    photo?: string;
};

type GeneralPageProps = {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    loading?: boolean;
    scroll?: boolean;
    contentStyle?: StyleProp<ViewStyle>;
    showUserHeader?: boolean;
};

export default function GeneralPage({
    title,
    subtitle,
    children,
    loading = false,
    scroll = true,
    contentStyle,
    showUserHeader = true,
}: GeneralPageProps) {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!showUserHeader) {
            return;
        }

        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await API.get("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch {
                setUser(null);
            }
        };

        void fetchUser();
    }, [showUserHeader]);

    const openAccountPage = () => {
        router.push("/account");
    };

    const content = (
        <View style={[styles.content, contentStyle]}>
            {showUserHeader ? (
                <TouchableOpacity
                    style={styles.userHeader}
                    activeOpacity={0.75}
                    onPress={openAccountPage}
                >
                    <View style={styles.userInfo}>
                        <Text style={styles.userName} numberOfLines={1}>
                            {user?.name || "User"}
                        </Text>
                        {user?.email ? (
                            <Text style={styles.userEmail} numberOfLines={1}>
                                {user.email}
                            </Text>
                        ) : null}
                    </View>

                    {user?.photo ? (
                        <Image
                            source={{ uri: user.photo }}
                            style={styles.userIcon}
                        />
                    ) : (
                        <View style={styles.userIcon}>
                            <Icon name="person" size={28} color="#6b7280" />
                        </View>
                    )}
                </TouchableOpacity>
            ) : null}

            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1a73e8" />
                </View>
            ) : (
                children
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {scroll ? (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {content}
                </ScrollView>
            ) : (
                content
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f9ff",
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    userHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 14,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    userInfo: {
        flex: 1,
        marginRight: 12,
    },
    greeting: {
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1f2937",
    },
    userEmail: {
        fontSize: 13,
        color: "#6b7280",
        marginTop: 2,
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: "#6b7280",
        marginBottom: 18,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
});
