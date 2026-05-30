import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Platform,
} from 'react-native';
import {Link, type Href, Stack} from "expo-router";
import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import GeneralPage from "@/app/components/GeneralPage";
import {Filter} from "@/app/components/filter";

type TaskRowType = {
    id: string;
    title: string;
    description: string;
    date: string;
    studentName: string;
    classTitle: string;
    href: Href;
};

type TaskType = TaskRowType[];

export default function TaskListPage() {
    const {t} = useTranslation();

    const [taskData, setTaskData] = useState<TaskType>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            <Stack.Screen options={{title: t('Tasks')}}/>

            {/* If there is FlatList child element, the scroll must be false */}
            <GeneralPage showHomeButton={true} showFilterButton={true} filterButtonHref={'/task/filter/month'} scroll={false}>
                <View style={styles.container}>
                    <Filter
                        filters={{
                            month: "month",
                            subjectByUser: "subjectByUser",
                        }}
                        pageDataRoute={'/task'}
                        setPageData={setTaskData}
                        setPageDataLoading={setLoading}
                        setPageDataError={setError}
                        emptyPageData={[] as TaskType}
                    />

                    {loading ? (
                            <Text style={styles.messageText}>{t('Loading...')}</Text>
                        ) : error ? (
                            <Text style={styles.messageText}>{t('No tasks found')}</Text>
                        ) : taskData.length > 0 ? (
                            <FlatList
                                data={taskData}
                                keyExtractor={(item) => item.id}
                                renderItem={({item}) => (
                                    <Link
                                        href={{
                                            pathname: '/task/[id]',
                                            params: {
                                                id: item.id,
                                                title: item.title,
                                                description: item.description,
                                                date: item.date,
                                                studentName: item.studentName,
                                                classTitle: item.classTitle,
                                            },
                                        }}
                                        style={styles.task}
                                    >
                                        <View>
                                            <Text style={styles.taskTitle}>{item.title}</Text>
                                            <Text style={styles.taskDate}>{item.date}</Text>
                                        </View>
                                    </Link>
                                )}
                                ListEmptyComponent={<Text style={styles.noTasks}>No tasks this month.</Text>}
                            />
                        ) : (
                            <Text style={styles.messageText}>{t('No tasks found')}</Text>
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
        header: {
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            marginBottom: 5,
        },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    pickerWrapper: {
        borderWidth: Platform.OS === 'android' ? 1 : 0,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    task: {
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
    taskTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a73e8',
    },
    taskDate: {
        fontSize: 15,
        color: '#1a73e8',
    },
    noTasks: {
        marginTop: 20,
        fontStyle: 'italic',
        color: '#888',
    },
    bottomNav: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#f5f9ff',
        marginBottom: 40,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 16,
        color: '#1a73e8',
        marginTop: 4,
    },
});
