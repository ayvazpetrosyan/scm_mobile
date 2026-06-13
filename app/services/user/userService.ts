import ApiService from "../api/apiService";
import {getScmUser, isExistScmUser} from "@/app/services/storage/userStorage";
import {getScmToken} from "@/app/services/storage/tokenStorage";

export async function fetchScmUser() {
    if (await isExistScmUser()) {
        const userFromStorage = await getScmUser()
        return JSON.parse(typeof userFromStorage === "string" ? userFromStorage : '');
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
