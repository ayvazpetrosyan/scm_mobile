import React, {useMemo, useState} from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import GeneralPage from "@/app/components/GeneralPage";
import {Stack} from "expo-router";
import {useTranslation} from "react-i18next";
import {Filter} from "@/app/components/filter";

type JournalRowType = {
    id: string;
    subjects: string;
    [key: string]: string;
};

type JournalApiResponseType = Record<string, Omit<JournalRowType, 'id'>>;

export default function Journal() {
    const {t} = useTranslation();

    const [pageData, setPageData] = useState<JournalApiResponseType>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const journalRows = useMemo<JournalRowType[]>(() => {
        return Object.entries(pageData ?? {}).map(([id, row]) => ({
            id,
            ...row,
        }));
    }, [pageData]);

    return (
        <>
            <Stack.Screen options={{title: t("Journal")}}/>

            <GeneralPage showHomeButton={true} scroll={false}>
                <View style={styles.container}>
                    <Filter
                        filters={{
                            month: "month",
                        }}
                        pageDataRoute={"/journal/data/read"}
                        setPageData={setPageData}
                        setPageDataLoading={setLoading}
                        setPageDataError={setError}
                        emptyPageData={{}}
                    />

                    {loading ? (
                        <Text style={styles.messageText}>{t('Loading...')}</Text>
                    ) : error ? (
                        <Text style={styles.messageText}>{t('No data found')}</Text>
                    ) : journalRows.length > 0 ? (
                        <FlatList
                            data={journalRows}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                            renderItem={({item}) => {
                                const grades = Object.entries(item).filter(
                                    ([key, value]) => key !== 'id' && key !== 'subjects' && Boolean(value)
                                );

                                return (
                                    <View style={styles.scheduleCard}>
                                        <Text style={styles.scheduleTitle}>{item.subjects}</Text>

                                        <View style={styles.gradesColumn}>
                                            {grades.length > 0 ? (
                                                grades.map(([date, grade]) => (
                                                    <View key={`${item.id}-${date}`} style={styles.gradeItem}>
                                                        <Text style={styles.gradeDate}>{date}</Text>
                                                        <Text style={styles.gradeValue}>{grade}</Text>
                                                    </View>
                                                ))
                                            ) : (
                                                <Text style={styles.emptyGrades}>{t('No data found')}</Text>
                                            )}
                                        </View>
                                    </View>
                                );
                            }}
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
    listContent: {
        paddingTop: 12,
        paddingBottom: 24,
    },
    messageText: {
        color: '#64748b',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    scheduleCard: {
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
    scheduleTitle: {
        backgroundColor: '#1a73e8',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    gradesColumn: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    gradeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    gradeDate: {
        color: '#64748b',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 10,
    },
    gradeValue: {
        color: '#1a73e8',
        fontSize: 15,
        fontWeight: '800',
        flex: 1,
        textAlign: 'right',
    },
    emptyGrades: {
        color: '#94a3b8',
        fontSize: 14,
        fontStyle: 'italic',
    },
});
