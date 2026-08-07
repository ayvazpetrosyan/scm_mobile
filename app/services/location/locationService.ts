import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import ApiService from "@/app/services/api/apiService";
import {getScmToken} from "@/app/services/storage/tokenStorage";
import {fetchUserFromStorage} from "@/app/services/user/userService";
import {Platform} from "react-native";

const DRIVER_LOCATION_TASK_NAME = "driver-background-location-task";

type ShareLocationResponse = {
    success?: boolean;
    message?: string;
};

async function canCurrentUserShareLocation(): Promise<boolean> {
    const user = await fetchUserFromStorage();

    return user?.permissions?.some(
        (permission) =>
            permission.controller === "Transport" &&
            permission.action === "shareLocation",
    ) ?? false;
}

async function sendLocationToApi(latitude: number, longitude: number): Promise<ShareLocationResponse> {
    const token = await getScmToken();

    if (!token) {
        throw new Error("No token found");
    }

    const payload = {
        location_latitude: latitude,
        location_longitude: longitude,
        date: new Date().toISOString(),
    };

    const response = await ApiService.post("/transport/locaton/share", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log('response', response);

    return response.data;
}

if (Platform.OS !== "web") {
    TaskManager.defineTask(
        DRIVER_LOCATION_TASK_NAME,
        async ({data, error}: TaskManager.TaskManagerTaskBody<{ locations: Location.LocationObject[] }>) => {
            if (error) {
                console.error("Background location task error:", error);
                return;
            }

            const canShareLocation = await canCurrentUserShareLocation();

            if (!canShareLocation) {
                console.log("No permission to share location");
                await stopDriverLocationTracking();
                return;
            }

            const location = data?.locations?.[0];

            if (!location) {
                console.log("Location is null");
                return;
            }

            try {
                await sendLocationToApi(
                    location.coords.latitude,
                    location.coords.longitude,
                );
            } catch (sendError) {
                console.error("Error sending background location:", sendError);
            }
        },
    );
}

export async function shareCurrentUserLocation(): Promise<ShareLocationResponse> {
    const {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Location permission denied");
    }

    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

    return sendLocationToApi(
        location.coords.latitude,
        location.coords.longitude,
    );
}

export async function shareCurrentUserLocationIfAllowed(): Promise<void> {
    const canShareLocation = await canCurrentUserShareLocation();

    if (!canShareLocation) {
        return;
    }

    await shareCurrentUserLocation();
}

export async function startDriverLocationTrackingIfAllowed(): Promise<void> {
    if (Platform.OS === "web") {
        return;
    }
    const canShareLocation = await canCurrentUserShareLocation();

    console.log('4444');
    if (!canShareLocation) {
        console.log("Can`t share location");
        await stopDriverLocationTracking();
        return;
    }

    const foregroundPermission = await Location.requestForegroundPermissionsAsync();

    if (foregroundPermission.status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Foreground location permission denied");
    }

    const backgroundPermission = await Location.requestBackgroundPermissionsAsync();

    if (backgroundPermission.status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Background location permission denied");
    }

    const hasStarted = await TaskManager.isTaskRegisteredAsync(
        DRIVER_LOCATION_TASK_NAME,
    );

    if (hasStarted) {
        return;
    }

    await Location.startLocationUpdatesAsync(DRIVER_LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000,
        distanceInterval: 20,
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
            notificationTitle: "School transport location is active",
            notificationBody: "Your location is being shared for bus route tracking.",
            notificationColor: "#1a73e8",
        },
    });
}

export async function stopDriverLocationTracking(): Promise<void> {
    if (Platform.OS === "web") {
        return;
    }
    const hasStarted = await TaskManager.isTaskRegisteredAsync(
        DRIVER_LOCATION_TASK_NAME,
    );

    if (!hasStarted) {
        return;
    }

    await Location.stopLocationUpdatesAsync(DRIVER_LOCATION_TASK_NAME);
}
