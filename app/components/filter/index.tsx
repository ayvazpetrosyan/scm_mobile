import React, {useEffect, useState} from "react";
import {ActivityIndicator, Platform, StyleSheet, Text, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/app/services/api";

export type FilterValues = {
    studyYear: string;
    month: string;
    className: string;
    subject: string;
};

type FilterOption = {
    label: string;
    value: string;
};

type FilterOptions = {
    studyYears: FilterOption[];
    months: FilterOption[];
    classes: FilterOption[];
    subjects: FilterOption[];
};

type FilterProps = {
    values: FilterValues;
    onChange: (values: FilterValues) => void;
};

const emptyOptions: FilterOptions = {
    studyYears: [],
    months: [],
    classes: [],
    subjects: [],
};

const defaultOptions = {
    studyYears: [{label: "All study years", value: ""}],
    months: [{label: "All months", value: ""}],
    classes: [{label: "All classes", value: ""}],
    subjects: [{label: "All subjects", value: ""}],
};

const normalizeOptions = (items: unknown): FilterOption[] => {
    if (!Array.isArray(items)) {
        return [];
    }

    return items.map((item) => {
        if (typeof item === "string" || typeof item === "number") {
            return {
                label: String(item),
                value: String(item),
            };
        }

        if (item && typeof item === "object") {
            const option = item as {
                label?: string | number;
                name?: string | number;
                title?: string | number;
                value?: string | number;
                id?: string | number;
            };

            return {
                label: String(option.label ?? option.name ?? option.title ?? option.value ?? option.id ?? ""),
                value: String(option.value ?? option.id ?? option.label ?? option.name ?? option.title ?? ""),
            };
        }

        return {
            label: "",
            value: "",
        };
    }).filter((item) => item.label !== "" && item.value !== "");
};

export default function Filter({values, onChange}: FilterProps) {
    const [options, setOptions] = useState<FilterOptions>(emptyOptions);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                setLoading(true);
                setError("");

                const token = await AsyncStorage.getItem("token");

                const response = await API.get("/filter", {
                    headers: token
                        ? {
                            Authorization: `Bearer ${token}`,
                        }
                        : undefined,
                });

                setOptions({
                    studyYears: normalizeOptions(response.data?.studyYears ?? response.data?.study_years),
                    months: normalizeOptions(response.data?.months),
                    classes: normalizeOptions(response.data?.classes),
                    subjects: normalizeOptions(response.data?.subjects),
                });
            } catch (fetchError) {
                console.error("Error loading filters:", fetchError);
                setError("Unable to load filters.");
            } finally {
                setLoading(false);
            }
        };

        void fetchFilters();
    }, []);

    const updateFilter = (key: keyof FilterValues, value: string) => {
        onChange({
            ...values,
            [key]: value,
        });
    };

    const studyYearOptions = [...defaultOptions.studyYears, ...options.studyYears];
    const monthOptions = [...defaultOptions.months, ...options.months];
    const classOptions = [...defaultOptions.classes, ...options.classes];
    const subjectOptions = [...defaultOptions.subjects, ...options.subjects];

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#1a73e8"/>
                    <Text style={styles.loadingText}>Loading filters...</Text>
                </View>
            ) : null}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {values.studyYear && (
                <View style={styles.field}>
                    <Text style={styles.label}>Study year</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={values.studyYear}
                            onValueChange={(value) => updateFilter("studyYear", String(value))}
                            style={styles.picker}
                            enabled={!loading}
                        >
                            {studyYearOptions.map((item) => (
                                <Picker.Item key={item.value} label={item.label} value={item.value}/>
                            ))}
                        </Picker>
                    </View>
                </View>
            )}

            {values.month && (
                <View style={styles.field}>
                    <Text style={styles.label}>Month</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={values.month}
                            onValueChange={(value) => updateFilter("month", String(value))}
                            style={styles.picker}
                            enabled={!loading}
                        >
                            {monthOptions.map((item) => (
                                <Picker.Item key={item.value} label={item.label} value={item.value}/>
                            ))}
                        </Picker>
                    </View>
                </View>
            )}

            {values.className && (
                <View style={styles.field}>
                    <Text style={styles.label}>Class</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={values.className}
                            onValueChange={(value) => updateFilter("className", String(value))}
                            style={styles.picker}
                            enabled={!loading}
                        >
                            {classOptions.map((item) => (
                                <Picker.Item key={item.value} label={item.label} value={item.value}/>
                            ))}
                        </Picker>
                    </View>
                </View>
            )}

            {values.subject && (
                <View style={styles.field}>
                    <Text style={styles.label}>Subject</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={values.subject}
                            onValueChange={(value) => updateFilter("subject", String(value))}
                            style={styles.picker}
                            enabled={!loading}
                        >
                            {subjectOptions.map((item) => (
                                <Picker.Item key={item.value} label={item.label} value={item.value}/>
                            ))}
                        </Picker>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    loadingText: {
        marginLeft: 8,
        color: "#6b7280",
        fontSize: 13,
    },
    errorText: {
        color: "#dc2626",
        fontSize: 13,
        marginBottom: 12,
    },
    field: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 6,
    },
    pickerWrapper: {
        borderWidth: Platform.OS === "android" ? 1 : 0,
        borderColor: "#d1d5db",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#f9fafb",
    },
    picker: {
        height: 50,
    },
});
