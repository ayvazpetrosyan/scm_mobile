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
import {Href, Link, useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import LanguageSwitcher from "./LanguageSwitcher";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

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
    showLanguageSwitcher?: boolean;
    showHomeButton?: boolean;
    showFilterButton?: boolean;
    filterButtonHref?: Href;
};

export default function GeneralPage({
    title,
    subtitle,
    children,
    loading = false,
    scroll = true,
    contentStyle,
    showUserHeader = false,
    showLanguageSwitcher = false,
    showHomeButton = true,
    showFilterButton = false,
    filterButtonHref = '/',
}: GeneralPageProps) {
    const {t} = useTranslation();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");

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
                await AsyncStorage.removeItem("token");
                router.replace("/login");
            }
        };

        void fetchUser();
    }, [showUserHeader, router]);

    const openAccountPage = () => {
        router.push("/account");
    };

    const openHomePage = () => {
        router.push("/");
    };

    const content = (
        <View style={[styles.content, contentStyle]}>
            <View style={styles.topBar}>
                <View style={styles.topActions}>
                    {showHomeButton ? (
                        <TouchableOpacity
                            style={styles.homeButton}
                            activeOpacity={0.75}
                            onPress={openHomePage}
                        >
                            <MaterialCommunityIcons
                                name="home"
                                size={22}
                                color="#ffffff"
                            />
                            <Text style={styles.homeButtonText}>{t('Home')}</Text>
                        </TouchableOpacity>
                    ) : null}

                    {showFilterButton ? (
                        <View style={styles.filterContainer}>
                            <Link href={filterButtonHref} asChild>
                                <TouchableOpacity style={styles.filterButton}>
                                    <Ionicons name="filter" size={20} color="#fff"/>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    ) : null}

                    {showLanguageSwitcher ? (
                        <LanguageSwitcher />
                    ) : null}
                </View>

                {showUserHeader ? (
                    <TouchableOpacity
                        style={styles.userHeader}
                        activeOpacity={0.75}
                        onPress={openAccountPage}
                    >
                        <View style={styles.userInfo}>
                            <Text style={styles.greeting}>Welcome</Text>
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
                                style={styles.userImage}
                            />
                        ) : (
                            <View style={styles.userIcon}>
                                <Text style={styles.userIconText}>
                                    {(user?.name || "U").charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ) : null}
            </View>

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
    topBar: {
        marginBottom: 18,
    },
    topActions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    homeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a73e8",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    homeButtonText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 6,
    },
    userHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
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
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#e5e7eb",
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
    },
    userIconText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a73e8",
    },
    languageSwitcherWrapper: {
        alignItems: "flex-end",
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
    filterContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    filterButton: {
        marginTop: 8,
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
    },
});
