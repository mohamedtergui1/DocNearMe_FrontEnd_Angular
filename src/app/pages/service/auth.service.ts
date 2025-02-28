import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { User as UserType , UserRole } from '../../model/User';

interface LoginResponse {
    user: Omit<UserType, 'password'>;
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<Partial<UserType> | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const storedUser = localStorage.getItem(this.USER_KEY);
        const storedToken = localStorage.getItem(this.TOKEN_KEY);

        if (storedUser && storedToken) {
            try {
                const user = JSON.parse(storedUser);
                this.currentUserSubject.next(user);
                this.isAuthenticatedSubject.next(true);  
            } catch (error) {
                this.logout();
            }
        }
    }

    login(email: string, password: string): Observable<UserType> {
        return this.http.get<UserType[]>('/users?email=' + email + "&password=" + password).pipe(
            map(users => {
                if (users.length === 0) {
                    throw { status: 404, message: 'The credentials do not match our records.' };
                }
                return users[0];
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    register(userData: UserType): Observable<UserType> {
        return this.http.post<UserType>(`/users`, userData);
    }

    logout(): void {
        this.http.post(`/auth/logout`, {}).subscribe({
            complete: () => {
                localStorage.removeItem(this.TOKEN_KEY);
                localStorage.removeItem(this.USER_KEY);
                this.currentUserSubject.next(null);
                this.router.navigate(['/auth/login']);
            }
        });
    }

    isAuthenticated(): boolean {
        return !!this.getToken() && !!this.currentUserSubject.value;
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getAuthUser(){
        return this.currentUser$
    }

    public storeAuthData(authData: LoginResponse): void {
        localStorage.setItem(this.TOKEN_KEY, authData.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
        this.currentUserSubject.next(authData.user);
    }

    updateProfile(userId: string, updates: UserType): Observable<UserType> {
        return this.http.put<UserType>(`/users/${userId}`, updates)
    }

    resetPassword(email: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`/auth/reset-password`, { email });
    }

    
}