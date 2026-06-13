import React, {useEffect, useState} from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import GeneralPage from "@/app/components/GeneralPage";
import {Stack} from "expo-router";
import {useTranslation} from "react-i18next";
import {getToken, removeToken} from "@/app/services/tokenStorage";
import ApiService from "@/app/services/apiService";

type ScheduleCellType = {
    id?: number | string;
    title: string;
};

type ScheduleApiRowType = {
    [key: string]: string | ScheduleCellType | undefined;
};

type ScheduleDayItemType = {
    id: string;
    title: string;
    lessons: {
        id: string;
        time: string;
        subject: string;
    }[];
};

type ScheduleType = ScheduleDayItemType[];

export default function Schedule() {
    const {t} = useTranslation();

    const [pageData, setPageData] = useState<ScheduleType>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        classId: '' as string | null,
    });

    const buildScheduleGrid = (scheduleRows: ScheduleApiRowType[]): ScheduleType => {
        if (!scheduleRows.length) {
            return [];
        }

        const headerRow = scheduleRows[0];
        const lessonRows = scheduleRows.slice(1);

        return Object.keys(headerRow)
            .filter((key) => key !== '0')
            .map((dayKey) => {
                const day = headerRow[dayKey] as ScheduleCellType;

                return {
                    id: String(day?.id ?? dayKey),
                    title: day?.title ?? '',
                    lessons: lessonRows
                        .map((row, index) => {
                            const lessonTime = row[0] as ScheduleCellType | undefined;
                            const subject = row[dayKey] as ScheduleCellType | undefined;

                            return {
                                id: `${dayKey}-${lessonTime?.id ?? index}`,
                                time: lessonTime?.title ?? '',
                                subject: subject?.title ?? '',
                            };
                        })
                        .filter((lesson) => lesson.time || lesson.subject),
                };
            })
            .filter((day) => day.title);
    };

    useEffect(() => {
        const fetchSchedule = async () => {
            const token = await getToken();
            if (!token) {
                setError("No token found");
                return;
            }

            /* The classId should exist for teacher and admin */
            const payload = {
                classId: formData.classId ?? null,
            };

            setLoading(true);
            setError(null);
            setPageData([]);

            ApiService.get("/schedule", {
                headers: {Authorization: `Bearer ${token}`},
                params: payload,
            })
                .then((response) => {
                    setPageData(buildScheduleGrid(response.data.schedule ?? []));
                })
                .catch((err) => {
                    console.error('Error fetching data:', err);
                    setError('Error fetching data');
                    setLoading(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        void fetchSchedule();
    }, [formData.classId]);

    return (
        <>
            <Stack.Screen options={{title: t("Schedule")}}/>

            {/* If there is FlatList child element, the scroll must be false */}
            <GeneralPage showHomeButton={true} scroll={false}>
                <View style={styles.container}>
                    {loading ? (
                        <Text style={styles.messageText}>{t('Loading...')}</Text>
                    ) : error ? (
                        <Text style={styles.messageText}>{t('No data found')}</Text>
                    ) : pageData.length > 0 || Object.keys(pageData)?.length > 0 ? (
                        <FlatList
                            data={pageData}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => (
                                <View style={styles.dayCard}>
                                    <Text style={styles.dayTitle}>{item.title}</Text>

                                    <View style={styles.lessonGrid}>
                                        {item.lessons.map((lesson) => (
                                            <View key={lesson.id} style={styles.lessonRow}>
                                                <View style={styles.timeColumn}>
                                                    <Text style={styles.lessonTime}>{lesson.time}</Text>
                                                </View>

                                                <View style={styles.subjectColumn}>
                                                    <Text style={styles.subjectTitle}>
                                                        {lesson.subject || t('No data found')}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.noSchedule}>{t('No data found')}</Text>
                            }
                        />
                    ) : (
                        <Text style={styles.messageText}>{t('No data found')}</Text>
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
    scheduleCard: {
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    scheduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 8,
    },
    scheduleTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#1a73e8',
    },
    scheduleTime: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
    },
    scheduleText: {
        fontSize: 15,
        color: '#334155',
        marginTop: 4,
    },
    dayCard: {
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
    dayTitle: {
        backgroundColor: '#1a73e8',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    lessonGrid: {
        borderTopWidth: 1,
        borderTopColor: '#dbeafe',
    },
    lessonRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        minHeight: 52,
    },
    timeColumn: {
        width: 95,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderRightColor: '#dbeafe',
    },
    subjectColumn: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    lessonTime: {
        color: '#0f172a',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    subjectTitle: {
        color: '#334155',
        fontSize: 15,
        fontWeight: '600',
    },
    noSchedule: {
        marginTop: 20,
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
    },
});
