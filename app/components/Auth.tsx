import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import {getToken, removeToken} from "@/app/services/tokenStorage";
import Api from "@/app/services/api";

type AuthProps = {
    children: React.ReactNode;
};

export default function Auth({ children }: AuthProps) {
    const router = useRouter();

    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await getToken();

                if (!token) {
                    router.replace("/login");
                    return;
                }

                await Api.get("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAuthenticated(true);
            } catch {
                await removeToken();
                router.replace("/login");
            } finally {
                setChecking(false);
            }
        };

        void checkAuth();
    }, [router]);

    if (checking) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a73e8" />
            </View>
        );
    }

    if (!authenticated) {
        return null;
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f9ff",
    },
});
