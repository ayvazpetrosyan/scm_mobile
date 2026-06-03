import {getStorage, removeStorage, setStorage} from "@/app/services/storage";

const TOKEN_KEY = 'token';

export async function setToken(token: string) {
  await setStorage(TOKEN_KEY, token);
}

export async function getToken() {
  return await getStorage(TOKEN_KEY);
}

export async function removeToken() {
  await removeStorage(TOKEN_KEY);
}
