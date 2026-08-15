import GeneralPage from "@/app/components/GeneralPage";
import {SafeAreaProvider} from "react-native-safe-area-context";
import React, {useEffect, useMemo, useState} from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
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

type OrderDishType = {
    id: number;
    dishName?: string;
    unitPrice?: number;
    unit_price?: number;
    unitCount?: number;
    unit_count?: number;
    count?: number;
    unit?: string | {
        translation?: { title?: string };
    };
    translation?: { title?: string };
};

type DishesByWeekDayType = {
    id: number | string;
    title?: string;
    date?: string;
    dishes: OrderDishType[];
};

type SelectedDishCountsType = Record<string, Record<number, number>>;

type OrderHistoryType = {
    id: number;
    date: string;
    dishes: DishType[];
    dalyTotalPrice: number;
};

type OrderResponseType = {
    orderHistory?: OrderHistoryType[];
    weekCountForOrderHistory?: number;
    dishesByWeekDays?: DishesByWeekDayType[];
};

export default function Canteen() {
    const {t} = useTranslation();
    const [orderHistory, setOrderHistory] = useState<OrderHistoryType[]>([]);
    const [dishesByWeekDays, setDishesByWeekDays] = useState<DishesByWeekDayType[]>([]);
    const [selectedDishCounts, setSelectedDishCounts] = useState<SelectedDishCountsType>({});
    const [weekCountForOrderHistory, setWeekCountForOrderHistory] = useState(4);
    const [loading, setLoading] = useState(false);
    const [savingDayId, setSavingDayId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const getDishName = (dish: OrderDishType) => {
        return dish.dishName ?? dish.translation?.title ?? '';
    };

    const getDishUnitPrice = (dish: OrderDishType) => {
        return Number(dish.unitPrice ?? dish.unit_price ?? 0);
    };

    const getDishUnitCount = (dish: OrderDishType) => {
        return Number(dish.unitCount ?? dish.unit_count ?? 0);
    };

    const getDishUnit = (dish: OrderDishType) => {
        if (typeof dish.unit === 'string') {
            return dish.unit;
        }

        return dish.unit?.translation?.title ?? '';
    };

    const getDishSelectedCount = (dayId: string, dishId: number) => {
        return selectedDishCounts[dayId]?.[dishId] ?? 0;
    };

    const getDishTotalPrice = (dayId: string, dish: OrderDishType) => {
        return getDishUnitPrice(dish) * getDishSelectedCount(dayId, dish.id);
    };

    const getDayTotalPrice = (day: DishesByWeekDayType) => {
        const dayId = String(day.id);

        return day.dishes.reduce((sum, dish) => {
            return sum + getDishTotalPrice(dayId, dish);
        }, 0);
    };

    const weekTotalPrice = useMemo(() => {
        return dishesByWeekDays.reduce((sum, day) => sum + getDayTotalPrice(day), 0);
    }, [dishesByWeekDays, selectedDishCounts]);

    const updateDishCount = (dayId: string, dishId: number, value: string) => {
        const numericValue = Number(value.replace(/[^0-9]/g, ''));

        setSelectedDishCounts((previousCounts) => ({
            ...previousCounts,
            [dayId]: {
                ...(previousCounts[dayId] ?? {}),
                [dishId]: Number.isNaN(numericValue) ? 0 : numericValue,
            },
        }));
    };

    const saveDayOrder = async (day: DishesByWeekDayType) => {
        const token = await getScmToken();
        const dayId = String(day.id);

        const dishes = day.dishes
            .map((dish) => ({
                dishId: dish.id,
                count: getDishSelectedCount(dayId, dish.id),
            }))
            .filter((dish) => dish.count > 0);

        if (!dishes.length) {
            setError(t('Please choose at least one dish'));
            return;
        }

        setSavingDayId(dayId);
        setError(null);
        setSuccessMessage(null);

        ApiService.post('/canteen/order/store', {
            weekDayId: day.id,
            date: day.date ?? null,
            dishes,
        }, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(() => {
                setSuccessMessage(t('Order saved successfully'));
            })
            .catch((err) => {
                console.error('Error saving canteen order:', err);
                setError(t('Error saving order'));
            })
            .finally(() => {
                setSavingDayId(null);
            });
    };

    useEffect(() => {
        const getOrderHistory = async () => {
            const token = await getScmToken();

            setLoading(true);
            setError(null);

            ApiService.get<OrderResponseType>('/canteen/order', {
                headers: {Authorization: `Bearer ${token}`},
            })
                .then((response) => {
                    setOrderHistory(Array.isArray(response.data.orderHistory) ? response.data.orderHistory : []);
                    setDishesByWeekDays(Array.isArray(response.data.dishesByWeekDays) ? response.data.dishesByWeekDays : []);
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

        void getOrderHistory();
    }, []);

    return (
        <GeneralPage scroll={false}>
            <SafeAreaProvider>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('Canteen')}</Text>
                        <Text style={styles.description}>
                            {t('Choose dishes for each day of next week.')}
                        </Text>
                    </View>

                    {loading ? (
                        <Text style={styles.messageText}>{t('Loading...')}</Text>
                    ) : (
                        <FlatList
                            data={dishesByWeekDays}
                            keyExtractor={(item) => String(item.id)}
                            ListHeaderComponent={
                                <View>
                                    {error ? (
                                        <Text style={styles.errorText}>{error}</Text>
                                    ) : null}

                                    {successMessage ? (
                                        <Text style={styles.successText}>{successMessage}</Text>
                                    ) : null}

                                    <View style={styles.weekTotalCard}>
                                        <Text style={styles.weekTotalLabel}>{t('Total sum for the whole week')}</Text>
                                        <Text style={styles.weekTotalValue}>
                                            {weekTotalPrice} {t('AMD')}
                                        </Text>
                                    </View>

                                    <Text style={styles.sectionHeading}>{t('Next week order')}</Text>
                                </View>
                            }
                            renderItem={({item}) => {
                                const dayId = String(item.id);
                                const dayTotalPrice = getDayTotalPrice(item);

                                return (
                                    <View style={styles.orderCard}>
                                        <View style={styles.orderHeader}>
                                            <Text style={styles.dateLabel}>{item.title ?? t('Day')}</Text>
                                            <Text style={styles.dateValue}>{item.date ?? ''}</Text>
                                        </View>

                                        <View style={styles.dishesContainer}>
                                            {item.dishes.map((dish) => {
                                                const selectedCount = getDishSelectedCount(dayId, dish.id);
                                                const dishTotalPrice = getDishTotalPrice(dayId, dish);

                                                return (
                                                    <View key={dish.id} style={styles.orderDishRow}>
                                                        <View style={styles.orderDishInfo}>
                                                            <Text style={styles.dishTitle}>{getDishName(dish)}</Text>
                                                            <Text style={styles.dishMeta}>
                                                                {getDishUnitPrice(dish)} {t('AMD')} / {getDishUnitCount(dish)} {getDishUnit(dish)}
                                                            </Text>
                                                            <Text style={styles.dishMeta}>
                                                                {t('Total price')}: {dishTotalPrice} {t('AMD')}
                                                            </Text>
                                                        </View>

                                                        <TextInput
                                                            style={styles.countInput}
                                                            keyboardType="number-pad"
                                                            value={selectedCount ? String(selectedCount) : ''}
                                                            placeholder="0"
                                                            onChangeText={(value) => updateDishCount(dayId, dish.id, value)}
                                                        />
                                                    </View>
                                                );
                                            })}
                                        </View>

                                        <View style={styles.totalRow}>
                                            <Text style={styles.totalLabel}>{t('Daily total price')}</Text>
                                            <Text style={styles.totalValue}>
                                                {dayTotalPrice} {t('AMD')}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={[
                                                styles.saveButton,
                                                savingDayId === dayId && styles.saveButtonDisabled,
                                            ]}
                                            activeOpacity={0.75}
                                            disabled={savingDayId === dayId}
                                            onPress={() => saveDayOrder(item)}
                                        >
                                            <Text style={styles.saveButtonText}>
                                                {savingDayId === dayId ? t('Saving...') : t('Save order')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                            ListEmptyComponent={
                                <Text style={styles.messageText}>{t('No data found')}</Text>
                            }
                            ListFooterComponent={
                                <View>
                                    <Text style={styles.sectionHeading}>{t('Order history')}</Text>
                                    <Text style={styles.description}>
                                        {t('Here you can see your order history for the last')} {weekCountForOrderHistory} {t('weeks.')}
                                    </Text>

                                    {orderHistory.length > 0 ? (
                                        orderHistory.map((item) => (
                                            <View key={item.id} style={styles.orderCard}>
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
                                        ))
                                    ) : (
                                        <Text style={styles.messageText}>{t('No data found')}</Text>
                                    )}
                                </View>
                            }
                        />
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
    sectionHeading: {
        color: '#1f2937',
        fontSize: 20,
        fontWeight: '800',
        marginTop: 18,
        marginBottom: 10,
    },
    messageText: {
        color: '#64748b',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        color: '#dc2626',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    successText: {
        color: '#16a34a',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    weekTotalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    weekTotalLabel: {
        color: '#334155',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    weekTotalValue: {
        color: '#16a34a',
        fontSize: 22,
        fontWeight: '900',
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
    orderDishRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    orderDishInfo: {
        flex: 1,
        marginRight: 10,
    },
    dishTitle: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
    },
    dishMeta: {
        color: '#64748b',
        fontSize: 13,
        marginTop: 3,
    },
    dishCount: {
        color: '#1a73e8',
        fontSize: 14,
        fontWeight: '800',
        textAlign: 'right',
    },
    countInput: {
        width: 68,
        minHeight: 42,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        paddingHorizontal: 8,
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
    saveButton: {
        backgroundColor: '#16a34a',
        marginHorizontal: 12,
        marginBottom: 12,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#86efac',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '800',
    },
});
