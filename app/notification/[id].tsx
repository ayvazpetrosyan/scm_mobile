import {Href} from "expo-router";
import React from 'react';
import {StyleSheet, Text, StatusBar, View} from 'react-native';
import {Stack, useLocalSearchParams} from 'expo-router';
import {useTranslation} from "react-i18next";
import GeneralPage from "@/app/components/GeneralPage";

const NotificationDetail = () => {
    const {t} = useTranslation();

    const {
        title,
        description,
        date,
        senderName,
    } = useLocalSearchParams<{
        id: string;
        title?: string;
        description?: string;
        date?: string;
        senderName?: string;
    }>();

    return (
        <>
            <Stack.Screen options={{title: title || 'Notification Details'}}/>

            <GeneralPage showHomeButton={true}>
                <View style={styles.container}>
                    <Text style={styles.header}>{title}</Text>

                    <View style={styles.item}>
                        <Text style={styles.label}>{t('Date:')}</Text>
                        <Text style={styles.value}>{date}</Text>

                        {senderName ? (
                            <>
                                <Text style={styles.label}>{t('Sender:')}</Text>
                                <Text style={styles.value}>{senderName}</Text>
                            </>
                        ) : null}

                        <Text style={styles.label}>{t('Description:')}</Text>
                        <Text style={styles.value}>{description}</Text>
                    </View>
                </View>
            </GeneralPage>
        </>
    );
}

export default NotificationDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    item: {
        backgroundColor: '#c2cfff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 20,
        borderColor: 'black',
    },
    header: {
        fontSize: 32,
        backgroundColor: '#fff',
    },
    title: {
        backgroundColor: '#c2cfff',
        fontSize: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginTop: 4,
    },
});
