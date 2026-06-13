import {getStorage, removeStorage, setStorage} from "@/app/services/storage/storage";

const TOKEN_STORAGE_KEY = 'scmToken';

export async function setScmToken(token: string) {
  await setStorage(TOKEN_STORAGE_KEY, token);
}

export async function getScmToken() {
  return await getStorage(TOKEN_STORAGE_KEY);
}

export async function removeScmToken() {
  await removeStorage(TOKEN_STORAGE_KEY);
}
