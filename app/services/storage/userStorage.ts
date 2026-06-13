import {getStorage, removeStorage, setStorage} from "@/app/services/storage/storage";

const USER_STORAGE_KEY = 'scmUser';

export async function setScmUser(user: {
    name: string;
    email: string;
}) {
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
