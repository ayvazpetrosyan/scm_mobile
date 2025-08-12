import React from 'react';
import { StyleSheet, Text, View, SectionList, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const DATA = [
    {
        title: 'Ընտրել ամիս',
        data: [
            { key: 'september', title: 'Սեպտեմբեր', href: '/task/(tabs)/taskList?month=9' },
            { key: 'october', title: 'Հոկտեմբեր', href: '/task/(tabs)/taskList?month=10' },
            { key: 'november', title: 'Նոյեմբեր', href: '/task/(tabs)/taskList?month=11' },
            { key: 'december', title: 'Դեկտեմբեր', href: '/task/(tabs)/taskList?month=12' },
            { key: 'january', title: 'Հունվար', href: '/task/(tabs)/taskList?month=1' },
            { key: 'february', title: 'Փետրվար', href: '/task/(tabs)/taskList?month=2' },
            { key: 'march', title: 'Մարտ', href: '/task/(tabs)/taskList?month=3' },
            { key: 'april', title: 'Ապրիլ', href: '/task/(tabs)/taskList?month=4' },
            { key: 'may', title: 'Մայիս', href: '/task/(tabs)/taskList?month=5' },
            { key: 'jun', title: 'Հունիս', href: '/task/(tabs)/taskList?month=6' },
            { key: 'jul', title: 'Հուլիս', href: '/task/(tabs)/taskList?month=7' },
            { key: 'august', title: 'Օգոստոս', href: '/task/(tabs)/taskList?month=8' },
        ]
    }
];

export default function FilterScreen() {
    return (
        <SafeAreaProvider style={styles.page}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <SectionList
                    sections={DATA}
                    keyExtractor={(item, index) => item.key + index}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Link href={item.href} style={styles.link}>
                                <Text style={styles.monthText}>{item.title}</Text>
                            </Link>
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.header}>{title}</Text>
                    )}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#f5f9ff',
    },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 10,
        color: '#2d3e50',
    },
    card: {
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 8,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    link: {
        textAlign: 'center',
    },
    monthText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a73e8',
    },
});
