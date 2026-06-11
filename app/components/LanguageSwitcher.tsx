import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useTranslation} from "react-i18next";
import {setStorage} from "@/app/services/storage";

const LANGUAGES = [
    {code: "hy", label: "Հայ"},
    {code: "en", label: "EN"},
    {code: "ru", label: "RU"},
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.resolvedLanguage || i18n.language;

    const changeLanguage = async (language: string) => {
        try {
            await i18n.changeLanguage(language);
            await setStorage("language", language);
        } catch (error) {
            console.error("Unable to change language:", error);
        }
    };

    return (
        <View style={styles.container}>
            {LANGUAGES.map((language) => (
                <TouchableOpacity
                    key={language.code}
                    style={[
                        styles.button,
                        currentLanguage === language.code && styles.activeButton,
                    ]}
                    onPress={() => void changeLanguage(language.code)}
                >
                    <Text
                        style={[
                            styles.text,
                            currentLanguage === language.code && styles.activeText,
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
