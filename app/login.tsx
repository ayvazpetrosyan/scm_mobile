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
    ScrollView,
} from "react-native";
import {useRouter} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Api from "@/app/services/api";
import {useTranslation} from "react-i18next";
import {setToken} from "@/app/services/tokenStorage";

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
                    user_name: 'user_17',
                    password: 'tQtoD09S',
                }
            );

            const token = response.data.token;
            await setToken(token);

            router.replace("/account");
        } catch (error: any) {
            console.log("Login error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url,
                baseURL: error.config?.baseURL,
            });

            Alert.alert(t('Login failed'), t('Please check your credentials and try again.'));
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Icon name="lock" size={42} color="#4CAF50"/>
                    </View>

                    <Text style={styles.title}>{t('Welcome Back')}</Text>
                    <Text style={styles.subtitle}>{t('Learn. Grow. Succeed. Together.')}</Text>

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
                            returnKeyType="next"
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
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>{t('Login')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backText}>{t('Go back')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
        paddingBottom: 40,
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
