import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, StatusBar, FlatList, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {Link, type Href, useRouter} from 'expo-router';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from '../services/api';

type MenuItem = {
    key: string;
    title: string;
    href: Href;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

type User = {
    name: string;
    email: string;
    phone?: string;
    photo?: string;
};

const DATA: MenuItem[] = [
    {key: 'schedule', title: 'Դասացուցակ', href: '/schedule/index', icon: 'calendar-month'},
    {key: 'journal', title: 'Մատյան', href: '/journal/index', icon: 'book-open-page-variant'},
    {key: 'task', title: 'Առաջադրանք', href: '/task/index', icon: 'clipboard-check-outline'},
    {key: 'semester', title: 'Առաջադիմություն', href: '/semester/index', icon: 'chart-bar'},
    {key: 'absent', title: 'Բացակայություն', href: '/absent/index', icon: 'account-off'},
    {key: 'finance', title: 'ֆինանսներ', href: '/canteen/index', icon: 'finance'},
    {key: 'transport', title: 'Տրանսպորտ', href: '/canteen/index', icon: 'bus'},
    {key: 'canteen', title: 'Ճաշարան', href: '/canteen/index', icon: 'silverware-fork-knife'},
];

const App = () => {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");

                if (!token) {
                    router.replace("/login");
                    return;
                }

                const response = await axios.get('http://laravel_auth.loc/api/home', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch {
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        void fetchUser();
    }, [router]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <FlatList
                    data={DATA}
                    numColumns={2}
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.grid}
                    renderItem={({item}) => (
                        <Link href={item.href} style={styles.card}>
                            <View style={styles.iconWrapper}>
                                <MaterialCommunityIcons
                                    name={item.icon}
                                    size={48}
                                    color="#1a73e8"
                                />
                            </View>
                            {"\n"}
                            <Text style={styles.cardText}>{item.title}</Text>
                        </Link>
                    )}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#f5f9ff',
    },
    grid: {
        padding: 16,
    },
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        textAlign: 'center',
    },
    iconWrapper: {
        marginBottom: 10,
        alignItems: 'center',
    },
    cardText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2d3e50',
        textAlign: 'center',
    },
});

export default App;
