import { User } from "./User";

export interface Clinic {
    id: string;
    clinicOwnerName: User;
    clinicName: string;
    clinicAddress: string;
    categoryName: string;
}