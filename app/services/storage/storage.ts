// localStorage is not as secure as expo-secure-store.
// This is okay for local browser testing,
// but for production web apps need to use a more secure auth strategy,
// such as HTTP-only cookies.

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export async function setStorage(key: string, value: string) {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
    }

    await SecureStore.setItemAsync(key, value);
}

export async function getStorage(key: string) {
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    }

    return await SecureStore.getItemAsync(key);
}

export async function removeStorage(key: string) {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
    }

    await SecureStore.deleteItemAsync(key);
}
