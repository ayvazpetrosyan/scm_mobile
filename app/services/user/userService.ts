import ApiService from "../api/apiService";
import {getScmUser, isExistScmUser} from "@/app/services/storage/userStorage";
import {getScmToken} from "@/app/services/storage/tokenStorage";
import type {User} from "@/app/types/user";

export async function fetchScmUser(): Promise<User | null> {
    if (await isExistScmUser()) {
        const userFromStorage = await getScmUser()
        if (typeof userFromStorage !== "string") {
            return null;
        }
        return JSON.parse(userFromStorage) as User;
    }

    const token = await getScmToken();

    if (!token) {
        return null;
    }

    const response = await ApiService.get("/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}
