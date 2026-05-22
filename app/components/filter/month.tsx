import React, {useEffect} from 'react';
import {StyleSheet, Text, View, SectionList, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {Link, Stack} from 'expo-router';
import {useTranslation} from "react-i18next";

const DATA = [
    {
        title: 'Ընտրել ամիս',
        data: [
            {key: 'september', title: 'Սեպտեմբեր', href: '/task?month=9'},
            {key: 'october', title: 'Հոկտեմբեր', href: '/task?month=10'},
            {key: 'november', title: 'Նոյեմբեր', href: '/task?month=11'},
            {key: 'december', title: 'Դեկտեմբեր', href: '/task?month=12'},
            {key: 'january', title: 'Հունվար', href: '/task?month=1'},
            {key: 'february', title: 'Փետրվար', href: '/task?month=2'},
            {key: 'march', title: 'Մարտ', href: '/task?month=3'},
            {key: 'april', title: 'Ապրիլ', href: '/task?month=4'},
            {key: 'may', title: 'Մայիս', href: '/task?month=5'},
            {key: 'jun', title: 'Հունիս', href: '/task?month=6'},
            {key: 'jul', title: 'Հուլիս', href: '/task?month=7'},
            {key: 'august', title: 'Օգոստոս', href: '/task?month=8'},
        ]
    }
];

export default function FilterScreen() {
    const {t} = useTranslation();

    useEffect(() => {
        const fetchMonth = async () => {

        }
    });

    return (
        <>
            <Stack.Screen options={{title: t('Filter by month')}}/>

            <SafeAreaProvider style={styles.page}>
                <SafeAreaView style={styles.container} edges={['top']}>
                    <SectionList
                        sections={DATA}
                        keyExtractor={(item, index) => item.key + index}
                        renderItem={({item}) => (
                            <View style={styles.card}>
                                <Link href={item.href} style={styles.link}>
                                    <Text style={styles.monthText}>{item.title}</Text>
                                </Link>
                            </View>
                        )}
                        renderSectionHeader={({section: {title}}) => (
                            <Text style={styles.header}>{title}</Text>
                        )}
                    />
                </SafeAreaView>
            </SafeAreaProvider>
        </>
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#f5f9ff',
        height: '50%',
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
        shadowOffset: {width: 0, height: 2},
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
