import { UserRole } from './UserRole';

export interface User {
    id?: string;
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    role: UserRole
}
