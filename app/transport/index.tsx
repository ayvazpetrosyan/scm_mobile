import GeneralPage from "@/app/components/GeneralPage";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Text} from "react-native";
import React, {useEffect, useState} from "react";
import type {User} from "@/app/types/user";
import {getScmUser} from "@/app/services/storage/userStorage";

export default function Transport() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userFromStorage = await getScmUser();
            if (typeof userFromStorage !== "string") {
                return null;
            }
            const user = JSON.parse(userFromStorage);
            setUser(user);
        };

        void fetchUser();
    }, []);

    const permissions = user?.permissions || [];

    return (
        <GeneralPage title={'Transport'}>
            <SafeAreaProvider>
                {permissions.find(p => p.controller === 'Transport' && p.action === 'shareLocation') !== undefined ? (
                    <Text>
                        driver page
                    </Text>
                ) : (
                    <Text numberOfLines={2}>
                        general transport page
                    </Text>
                )}
            </SafeAreaProvider>
        </GeneralPage>
    )
}
