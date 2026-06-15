import {Link, Stack, Href} from "expo-router";
import GeneralPage from "@/app/components/GeneralPage";
import {FlatList, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ApiService from "@/app/services/api/apiService";
import {getScmToken} from "@/app/services/storage/tokenStorage";

type NotificationRowType = {
    id: string;
    title: string;
    description: string;
    date: string;
    senderName: string;
    href: Href;
};

type NotificationType = NotificationRowType[];

export default function Notification() {
    const {t} = useTranslation();

    const [notificationData, setNotificationData] = useState<NotificationType>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = await getScmToken();

            setLoading(true);
            setError(null);

            ApiService.get('/notification', {
                headers: {Authorization: `Bearer ${token}`},
            }).then(response => {
                setNotificationData(response.data);
                setLoading(false);
                setError(null);
            }).catch(error => {
                console.log(error);
                setLoading(false);
                setError('Failed to fetch notifications');
            });
        };

        void fetchNotifications();
    }, []);

    return (
        <>
            <Stack.Screen options={{title: t('Notifications')}}/>

            {/* If there is FlatList child element, the scroll must be false */}
            <GeneralPage showHomeButton={true} scroll={false}>
                <View style={styles.container}>
                    {loading ? (
                        <Text style={styles.messageText}>{t('Loading...')}</Text>
                    ) : error ? (
                        <Text style={styles.messageText}>{t('No notifications found')}</Text>
                    ) : notificationData.length > 0 ? (
                        <FlatList
                            data={notificationData}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => (
                                <Link
                                    href={{
                                        pathname: '/notification/[id]',
                                        params: {
                                            id: item.id,
                                            title: item.title,
                                            description: item.description,
                                            date: item.date,
                                            senderName: item.senderName,
                                        },
                                    }}
                                    style={styles.notification}
                                >
                                    <View>
                                        <Text style={styles.notificationTitle}>{item.title}</Text>
                                        <Text style={styles.notificationDate}>{item.date}</Text>
                                    </View>
                                </Link>
                            )}
                            ListEmptyComponent={<Text style={styles.noNotifications}>No notifications this
                                month.</Text>}
                        />
                    ) : (
                        <Text style={styles.messageText}>{t('No notifications found')}</Text>
                    )}
                </View>
            </GeneralPage>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f9ff',
        paddingHorizontal: 16,
        flex: 1,
    },
    messageText: {
        color: '#64748b',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    notification: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        textAlign: 'center',
    },
    notificationTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a73e8',
    },
    notificationDate: {
        fontSize: 15,
        color: '#1a73e8',
    },
    noNotifications: {
        marginTop: 20,
        fontStyle: 'italic',
        color: '#888',
    },
});
