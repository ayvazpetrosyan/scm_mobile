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
};
