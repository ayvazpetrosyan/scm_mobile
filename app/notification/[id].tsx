import React from 'react';
import {Platform, StyleSheet, Text, StatusBar, View} from 'react-native';
import {Stack, useLocalSearchParams} from 'expo-router';
import {useTranslation} from "react-i18next";
import GeneralPage from "@/app/components/GeneralPage";

import {WebView} from "react-native-webview";

const HtmlDescription = ({html}: { html: string }) => {
    if (Platform.OS === 'web') {
        return React.createElement('div', {
            style: {
                fontSize: 16,
                color: '#000000',
                width: '100%',
            },
            dangerouslySetInnerHTML: {
                __html: html,
            },
        });
    }

    const htmlDescription = `
        <!DOCTYPE html>
        <html lang="">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-size: 16px;
                        color: #000000;
                        margin: 0;
                        padding: 0;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                ${html}
            </body>
        </html>
    `;
    
    return (
        <WebView
            originWhitelist={['*']}
            source={{html: htmlDescription}}
            style={styles.descriptionWebView}
        />
    );
}

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
            <Stack.Screen options={{title: title || t('Notification Details')}}/>

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
                        <View style={styles.descriptionContainer}>
                            <HtmlDescription html={description || ''}/>
                        </View>
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
    descriptionContainer: {
        height: 300,
        marginTop: 4,
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#ffffff',
    },
    descriptionWebView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});
