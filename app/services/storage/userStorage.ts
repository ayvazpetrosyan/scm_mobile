import {getStorage, removeStorage, setStorage} from "@/app/services/storage/storage";
import type {User} from "@/app/types/user";

const USER_STORAGE_KEY = 'scmUser';

export async function setScmUser(user: User) {
    await setStorage(USER_STORAGE_KEY, JSON.stringify(user));
}

export async function isExistScmUser() {
    return await getStorage(USER_STORAGE_KEY) !== undefined;
}

export async function getScmUser() {
    return await getStorage(USER_STORAGE_KEY);
}

export async function removeScmUser() {
    await removeStorage(USER_STORAGE_KEY);
}
