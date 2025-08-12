import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { Link, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';

const TASKS = [
    { id: '1', title: 'Buy groceries', date: '2025-10-02', href: '/task/1' },
    { id: '2', title: 'Finish project', date: '2025-10-25', href: '/task/2' },
    { id: '3', title: 'Visit dentist', date: '2025-10-15', href: '/task/3' },
    { id: '4', title: 'Call client 4', date: '2025-09-03', href: '/task/4' },
    { id: '5', title: 'Call client 5', date: '2025-09-03', href: '/task/5' },
    { id: '6', title: 'Call client 6', date: '2025-10-03', href: '/task/6' },
    { id: '7', title: 'Call client 7', date: '2025-10-03', href: '/task/7' },
    { id: '8', title: 'Call client 8', date: '2025-09-03', href: '/task/8' },
];

const sortTasksByMonth = (tasks) => {
    return [...tasks].sort((a, b) => {
        const monthA = new Date(a.date).getMonth();
        const monthB = new Date(b.date).getMonth();
        return monthA - monthB;
    });
};

const getMonthFromDate = (dateString: string | number | Date) => {
    return new Date(dateString).getMonth();
};

export default function TaskListPage() {
    const { month } = useLocalSearchParams();

    const selectedMonth = month ? Number(month) - 1 : null;

    const filteredTasks = selectedMonth === null
        ? TASKS // show all tasks if no month is provided
        : TASKS.filter((task) => getMonthFromDate(task.date) === selectedMonth);

    const sortedTasks = useMemo(() => sortTasksByMonth(filteredTasks), []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.filterContainer}>
                    <Link href="/task/filter" asChild>
                        <TouchableOpacity style={styles.filterButton}>
                            <Ionicons name="filter" size={20} color="#fff" />
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

            <FlatList
                data={sortedTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Link href={item.href} style={styles.task}>
                        <View>
                            <Text style={styles.taskTitle}>{item.title}</Text>
                            <Text style={styles.taskDate}>{item.date}</Text>
                        </View>
                    </Link>
                )}
                ListEmptyComponent={<Text style={styles.noTasks}>No tasks this month.</Text>}
            />

            <View style={styles.bottomNav}>
                <Link href="/" asChild>
                    <TouchableOpacity style={styles.navItem}>
                        <MaterialCommunityIcons name="home" size={24} color="#1a73e8" />
                        <Text style={styles.navText}>Home</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/(tabs)/notification" asChild>
                    <TouchableOpacity style={styles.navItem}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color="#1a73e8" />
                        <Text style={styles.navText}>Notification</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f9ff',
        paddingHorizontal: 16,
        flex: 1,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 5,
    },
    filterContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    filterButton: {
        marginTop: 8,
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
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
        shadowOffset: { width: 0, height: 2 },
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
