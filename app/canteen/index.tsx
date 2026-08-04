import GeneralPage from "@/app/components/GeneralPage";
import {SafeAreaProvider} from "react-native-safe-area-context";
import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {useTranslation} from "react-i18next";
import ApiService from "@/app/services/api/apiService";
import {getScmToken} from "@/app/services/storage/tokenStorage";

type DishType = {
    id: number;
    unit_price: number;
    unit_count: number;
    count: number;
    translation: { title: string };
    unit: {
        translation: { title: string };
    };
};

type OrderHistoryType = {
    id: number;
    date: string;
    dishes: DishType[];
    dalyTotalPrice: number;
};

type OrderResponseType = {
    orderHistory?: OrderHistoryType[];
    weekCountForOrderHistory?: number;
};

export default function Canteen() {
    const {t} = useTranslation();
    const [orderHistory, setOrderHistory] = useState<OrderHistoryType[]>([]);
    const [weekCountForOrderHistory, setWeekCountForOrderHistory] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getOrderHistory = async () => {
            const token = await getScmToken();

            setLoading(true);
            setError(null);

            ApiService.get<OrderResponseType>('/canteen/order', {
                headers: {Authorization: `Bearer ${token}`},
            })
                .then((response) => {
                    setOrderHistory(Array.isArray(response.data) ? response.data : []);
                    setWeekCountForOrderHistory(response.data.weekCountForOrderHistory ?? 0);
                })
                .catch((err) => {
                    console.error('Error fetching order history:', err);
                    setError('Error fetching order history');
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        getOrderHistory().then(r => console.error('order history'));
    }, []);

    return (
        <GeneralPage scroll={false}>
            <SafeAreaProvider>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('Order history')}</Text>
                        <Text style={styles.description}>
                            {t('Here you can see your order history for the last')} {weekCountForOrderHistory} {t('weeks.')}
                        </Text>
                    </View>

                    {loading ? (
                        <Text style={styles.messageText}>{t('Loading...')}</Text>
                    ) : error ? (
                        <Text style={styles.messageText}>{t('No data found')}</Text>
                    ) : orderHistory.length > 0 ? (
                        <FlatList
                            data={orderHistory}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <View style={styles.orderCard}>
                                    <View style={styles.orderHeader}>
                                        <Text style={styles.dateLabel}>{t('Date')}</Text>
                                        <Text style={styles.dateValue}>{item.date}</Text>
                                    </View>

                                    <View style={styles.dishesContainer}>
                                        <Text style={styles.sectionTitle}>{t('Dishes')}</Text>

                                        {item.dishes.map((dish) => (
                                            <View key={dish.id} style={styles.dishRow}>
                                                <Text style={styles.dishTitle}>
                                                    {dish.translation.title}
                                                </Text>
                                                <Text style={styles.dishCount}>
                                                    {dish.count} {dish.unit.translation.title}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>

                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>{t('Total price')}</Text>
                                        <Text style={styles.totalValue}>
                                            {item.dalyTotalPrice} {t('AMD')}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.messageText}>{t('No data found')}</Text>
                            }
                        />
                    ) : (
                        <Text style={styles.messageText}>{t('No data found')}</Text>
                    )}
                </View>
            </SafeAreaProvider>
        </GeneralPage>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f9ff',
        paddingHorizontal: 16,
        flex: 1,
    },
    header: {
        marginBottom: 18,
    },
    title: {
        color: '#1f2937',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 6,
    },
    description: {
        color: '#64748b',
        fontSize: 15,
        lineHeight: 22,
    },
    messageText: {
        color: '#64748b',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    orderCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    orderHeader: {
        backgroundColor: '#1a73e8',
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateLabel: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
    dateValue: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
    },
    dishesContainer: {
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    sectionTitle: {
        color: '#334155',
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 8,
    },
    dishRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dishTitle: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
    },
    dishCount: {
        color: '#1a73e8',
        fontSize: 14,
        fontWeight: '800',
        textAlign: 'right',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    totalLabel: {
        color: '#334155',
        fontSize: 15,
        fontWeight: '700',
    },
    totalValue: {
        color: '#16a34a',
        fontSize: 17,
        fontWeight: '900',
    },
});
