export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export type User = {
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    roles?: UserRole[];
};
