import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ViewStyle,
    StyleProp,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type GeneralPageProps = {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    loading?: boolean;
    scroll?: boolean;
    contentStyle?: StyleProp<ViewStyle>;
};

export default function GeneralPage({
                                        title,
                                        subtitle,
                                        children,
                                        loading = false,
                                        scroll = true,
                                        contentStyle,
                                    }: GeneralPageProps) {
    const content = (
        <View style={[styles.content, contentStyle]}>
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
