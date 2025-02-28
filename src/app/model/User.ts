import { UserRole } from './UserRole';

export interface User {
    id?: string;
    email: string;
    password: string;
    nom: string;
    prenom: string;
    adresse: {
        rue: string;
        ville: string;
        codePostal: string;
    };
    telephone: string;
    dateNaissance: string;
    role: UserRole;
    photoProfil?: string;
    lastLogin?: Date;
}
