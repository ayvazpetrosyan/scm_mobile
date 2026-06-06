import { StyleSheet } from 'react-native';
import {router} from "expo-router";

export default function NotificationScreen() {
    router.push("/notification");
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
    link: {
        marginTop: 15,
        backgroundColor: '#fff',
        color: 'green',
        fontSize: 16,
    }
});
