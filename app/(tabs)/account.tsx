// app/account.js
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function AccountPage() {
    const router = useRouter();

    // Mock user data
    const user = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 234 567 890",
        photo: "https://via.placeholder.com/100",
        password: "********"
    };

    const handleLogin = () => {
        router.push("/login");
    };

    const handleLogout = () => {
        // You can clear auth tokens here
        router.push("/logout");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Profile Picture */}
            <Image source={{ uri: user.photo }} style={styles.profileImage} />

            {/* User Info */}
            <View style={styles.infoContainer}>
                <InfoRow icon="person" label="Name" value={user.name} />
                <InfoRow icon="email" label="Email" value={user.email} />
                <InfoRow icon="phone" label="Phone" value={user.phone} />
                <InfoRow icon="lock" label="Password" value={user.password} />
            </View>

            {/* Actions */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Icon name="login" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="logout" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function InfoRow({ icon, label, value }) {
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
    container: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f9f9f9",
        flexGrow: 1
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20
    },
    infoContainer: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 2
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },
    label: {
        fontSize: 14,
        color: "#888"
    },
    value: {
        fontSize: 16,
        color: "#000",
        fontWeight: "500"
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10
    },
    loginButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F44336",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 5
    }
});
