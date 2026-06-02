import GeneralPage from "@/app/components/GeneralPage";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Filter} from "@/app/components/filter";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {FlatList, StyleSheet, Text, View} from "react-native";

type AbsentRowType = {
    studentName: string;
    absentInfo: {
        subjectId: string;
        subjectTitle: string;
        absentCount: number;
    }[];
};

type AbsentType = AbsentRowType[];

export default function Absent() {
    const {t} = useTranslation();

    const [pageData, setPageData] = useState<AbsentType>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    console.log('pageData', pageData);
    console.log('pageData.length', pageData.length);
    console.log('pageData.length 2', Object.keys(pageData)?.length);

    return (
        <GeneralPage title={'Absent'}>
            <SafeAreaProvider>
                <Filter
                    filters={{
                        semester: "semester",
                    }}
                    pageDataRoute={"/absent"}
                    setPageData={setPageData}
                    setPageDataLoading={setLoading}
                    setPageDataError={setError}
                    emptyPageData={[] as AbsentType}
                />

                {loading ? (
                    <Text style={styles.messageText}>{t('Loading...')}</Text>
                ) : error ? (
                    <Text style={styles.messageText}>{t('No data found')}</Text>
                ) : pageData.length > 0 || Object.keys(pageData)?.length > 0 ? (
                    <FlatList
                        data={pageData}
                        keyExtractor={(item) => item.studentName}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.subjectCard}>
                                    <Text style={styles.dayTitle}>{item.studentName}</Text>

                                    <View style={styles.gradesColumn}>
                                        {item.absentInfo.map((absent, index) => (
                                            <View key={`min-grade-${absent.subjectId}`} style={styles.gradeItem}>
                                                <Text style={styles.gradeName}>{absent.subjectTitle}</Text>
                                                <Text style={styles.gradeValue}>{absent.absentCount}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )
                        }}
                        ListEmptyComponent={
                            <Text style={styles.messageText}>{t('No data found')}</Text>
                        }
                    />
                ) : (
                    <Text style={styles.messageText}>{t('No data found')}</Text>
                )}
            </SafeAreaProvider>
        </GeneralPage>
    )
}

const styles = StyleSheet.create({
    messageText: {
        color: '#64748b',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    subjectCard: {
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
    subjectTitle: {
        color: '#334155',
        fontSize: 15,
        fontWeight: '600',
    },
    noSemester: {
        marginTop: 20,
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
    },
    gradeName: {
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
});