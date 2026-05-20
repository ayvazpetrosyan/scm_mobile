import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGES = [
    { code: "hy", label: "Հայ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = async (language: string) => {
    await AsyncStorage.setItem("language", language);
    await i18n.changeLanguage(language);
};

    return (
        <View style={styles.container}>
            {LANGUAGES.map((language) => (
                <TouchableOpacity
                    key={language.code}
                    style={[
                        styles.button,
                        i18n.language === language.code && styles.activeButton,
                    ]}
                    onPress={() => changeLanguage(language.code)}
                >
                    <Text
                        style={[
                            styles.text,
                            i18n.language === language.code && styles.activeText,
                        ]}
                    >
                        {language.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 8,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#e5e7eb",
    },
    activeButton: {
        backgroundColor: "#1a73e8",
    },
    text: {
        color: "#374151",
        fontWeight: "600",
    },
    activeText: {
        color: "#ffffff",
    },
});
