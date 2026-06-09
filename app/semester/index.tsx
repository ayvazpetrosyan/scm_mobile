import GeneralPage from "@/app/components/GeneralPage";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {FlatList, StyleSheet, Text, View} from "react-native";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Filter} from "@/app/components/filter";

type SemesterRowType = {
    subjectId: string;
    subjectTitle: string;
    minGrade: string;
    maxGrade: string;
    averageGrade: string;
    codeGrade: string;
    semesterGrade: string;
};

type SemesterType = SemesterRowType[];

export default function Semester() {
    const {t} = useTranslation();

    const [pageData, setPageData] = useState<SemesterType>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <GeneralPage scroll={false}>
            <SafeAreaProvider>
                <View style={styles.container}>
                    <Filter
                        filters={{
                            semester: "semester",
                        }}
                        pageDataRoute={"/semester"}
                        setPageData={setPageData}
                        setPageDataLoading={setLoading}
                        setPageDataError={setError}
                        emptyPageData={[] as SemesterType}
                    />

                    {loading ? (
                        <Text style={styles.messageText}>{t('Loading...')}</Text>
                    ) : error ? (
                        <Text style={styles.messageText}>{t('No data found')}</Text>
                    ) : Object.values(pageData).length > 0 ? (
                        <FlatList
                            data={Object.values(pageData)}
                            keyExtractor={(item) => item.subjectId}
                            renderItem={({item}) => {
                                return (
                                    <View style={styles.subjectCard}>
                                        <Text style={styles.dayTitle}>{item.subjectTitle}</Text>

                                        <View style={styles.gradesColumn}>
                                            <View key={`min-grade-${item.minGrade}`} style={styles.gradeItem}>
                                                <Text style={styles.gradeName}>{t('Min grade')}</Text>
                                                <Text style={styles.gradeValue}>{item.minGrade}</Text>
                                            </View>
                                            <View key={`max-grade-${item.maxGrade}`} style={styles.gradeItem}>
                                                <Text style={styles.gradeName}>{t('Max grade')}</Text>
                                                <Text style={styles.gradeValue}>{item.maxGrade}</Text>
                                            </View>
                                            <View key={`avg-grade-${item.averageGrade}`} style={styles.gradeItem}>
                                                <Text style={styles.gradeName}>{t('Average grade')}</Text>
                                                <Text style={styles.gradeValue}>{item.averageGrade}</Text>
                                            </View>
                                            <View key={`code-grade-${item.codeGrade}`} style={styles.gradeItem}>
                                                <Text style={styles.gradeName}>{t('Code grade')}</Text>
                                                <Text style={styles.gradeValue}>{item.codeGrade}</Text>
                                            </View>
                                            <View key={`semester-grade-${item.semesterGrade}`} style={styles.gradeItem}>
                                                <Text style={styles.gradeName}>{t('Semester grade')}</Text>
                                                <Text style={styles.gradeValue}>{item.semesterGrade}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                            ListEmptyComponent={
                                <Text style={styles.noSemester}>{t('No data found')}</Text>
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
    }
});
