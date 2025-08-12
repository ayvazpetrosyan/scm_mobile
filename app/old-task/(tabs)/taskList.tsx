import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Platform,
} from 'react-native';
import { Link, useLocalSearchParams } from "expo-router";

const TASKS = [
    { id: '1', title: 'Buy groceries', date: '2025-08-02', href: '/task/1' },
    { id: '2', title: 'Finish project', date: '2025-08-25', href: '/task/2' },
    { id: '3', title: 'Visit dentist', date: '2025-08-15', href: '/task/3' },
    { id: '4', title: 'Call client 4', date: '2025-09-03', href: '/task/4' },
    { id: '5', title: 'Call client 5', date: '2025-09-03', href: '/task/5' },
    { id: '6', title: 'Call client 6', date: '2025-08-03', href: '/task/6' },
    { id: '7', title: 'Call client 7', date: '2025-08-03', href: '/task/7' },
    { id: '8', title: 'Call client 8', date: '2025-09-03', href: '/task/8' },
];

const getMonthFromDate = (dateString: string | number | Date) => {
    return new Date(dateString).getMonth();
};

export default function TaskListPage() {
    const { month } = useLocalSearchParams();

    const selectedMonth = month ? Number(month) - 1 : new Date().getMonth();

    console.log(selectedMonth);

    const filteredTasks = TASKS.filter(
        (task) => getMonthFromDate(task.date) === selectedMonth
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Tasks by Month</Text>

            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.task}>
                        <Link href={item.href}>
                            <Text style={styles.taskTitle}>{item.title}</Text>
                        </Link>
                        <Text style={styles.taskDate}>{item.date}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noTasks}>No tasks this month.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        flex: 1,
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
        backgroundColor: '#f2f2f2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    taskDate: {
        fontSize: 12,
        color: '#666',
    },
    noTasks: {
        marginTop: 20,
        fontStyle: 'italic',
        color: '#888',
    },
});
