import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                    headerStyle: {
                        backgroundColor: '#25292e',
                    },
                    headerShadowVisible: false,
                    headerTintColor: '#fff',
                    tabBarStyle: {
                        backgroundColor: '#25292e',
                    },
            }}
        >
            <Tabs.Screen
                name="taskList"
                options={{
                    title: 'Առաջադրանքներ',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'list' : 'list-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="filter"
                options={{
                    title: 'Ֆիլտրել',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'filter' : 'filter-outline'} color={color} size={24}/>
                    ),
                }}
            />
        </Tabs>
    );
}
