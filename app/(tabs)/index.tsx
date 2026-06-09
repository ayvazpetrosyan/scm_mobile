import {StyleSheet, Text, View, StatusBar, FlatList} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {Link, type Href} from 'expo-router';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import GeneralPage from "@/app/components/GeneralPage";
import React from "react";
import {useTranslation} from "react-i18next";

type MenuItem = {
    key: string;
    title: string;
    href: Href;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const App = () => {
    const {t} = useTranslation();

    const DATA: MenuItem[] = [
        {key: 'schedule', title: t('Schedule'), href: '/schedule', icon: 'calendar-month'},
        {key: 'journal', title: t('Journal'), href: '/journal', icon: 'book-open-page-variant'},
        {key: 'task', title: t('Task'), href: '/task', icon: 'clipboard-check-outline'},
        {key: 'semester', title: t('Semester'), href: '/semester', icon: 'chart-bar'},
        {key: 'absent', title: t('Absent'), href: '/absent', icon: 'account-off'},
        {key: 'finance', title: t('Finance'), href: '/finance', icon: 'finance'},
        {key: 'transport', title: t('Transport'), href: '/transport', icon: 'bus'},
        {key: 'canteen', title: t('Canteen'), href: '/canteen', icon: 'silverware-fork-knife'},
    ];

    return (
        // If there is FlatList child element, the scroll must be false
        <GeneralPage showHomeButton={false} showBackButton={false} showUserHeader={true} scroll={false}>
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
        </GeneralPage>
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
