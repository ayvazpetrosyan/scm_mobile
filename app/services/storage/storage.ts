// localStorage is not as secure as expo-secure-store.
// This is okay for local browser testing,
// but for production web apps need to use a more secure auth strategy,
// such as HTTP-only cookies.

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const canUseLocalStorage = () => {
    return (
        Platform.OS === 'web' &&
        typeof globalThis !== 'undefined' &&
        typeof globalThis.localStorage !== 'undefined'
    );
};

export async function setStorage(key: string, value: string) {
    if (canUseLocalStorage()) {
        globalThis.localStorage.setItem(key, value);
        return;
    }

    if (Platform.OS === 'web') {
        return;
    }

    await SecureStore.setItemAsync(key, value);
}

export async function getStorage(key: string) {
    if (canUseLocalStorage()) {
        return globalThis.localStorage.getItem(key);
    }

    if (Platform.OS === 'web') {
        return null;
    }

    return await SecureStore.getItemAsync(key);
}

export async function removeStorage(key: string) {
    if (canUseLocalStorage()) {
        globalThis.localStorage.removeItem(key);
        return;
    }

    if (Platform.OS === 'web') {
        return;
    }

    await SecureStore.deleteItemAsync(key);
}
