export type User = {
    name: string;
    userName: string;
    email: string;
    roleTechnicalName?: string;
    photo: string;
    phone?: string;
    permissions: {
        controller: string;
        action: string;
    }[];
    vehicleTitleOnMap?: string|null;
    vehicleLineName?: string|null;
    vehicleRegistrationNumber?: string|null;
    vehicleDescription?: string|null;
    vehicleInfo?: string|null;
};
