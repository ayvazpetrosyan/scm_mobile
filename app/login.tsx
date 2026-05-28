import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import {useRouter} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from "@/app/services/api";
import {useTranslation} from "react-i18next";

export default function LoginPage() {
    const {t} = useTranslation();

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Missing information", "Please enter your email and password.");
            return;
        }

        try {
            const response = await Api.post(
                "/login",
                {
                    user_name: email,
                    password: password,
                }
            );

            const token = response.data.token;
            await AsyncStorage.setItem("token", token);

            router.replace("/account");
        } catch {
            Alert.alert("Login failed", "Please check your credentials and try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Icon name="lock" size={42} color="#4CAF50"/>
                </View>

                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Login to continue</Text>

                <View style={styles.inputContainer}>
                    <Icon name="email" size={22} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Email or username"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={22} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>{t('Login')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>{t('Go back')}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: "#777",
        textAlign: "center",
        marginTop: 6,
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f3f3",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 14,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: "#111",
    },
    loginButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
    },
    backText: {
        color: "#4CAF50",
        fontSize: 15,
        textAlign: "center",
        marginTop: 18,
        fontWeight: "500",
    },
});
