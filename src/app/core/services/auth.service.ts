import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { User  } from '../../model/User';
import { UserRole } from '../../model/UserRole';

export interface LoginResponse {
    user: Omit<User, 'password'>; 
    refreshToken: string; 
    accessToken: string; 
    refreshExpiresIn: number;
}

export interface RegisterRequest {
    password: string;
    name: string;
    email: string;
    role: UserRole;
    phoneNumber: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<Partial<User> | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly USER_KEY = 'current_user';
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const storedUser = localStorage.getItem(this.USER_KEY);
        const storedAccessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
        const storedRefreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

        if (storedUser && storedAccessToken && storedRefreshToken) {
            try {
                const user = JSON.parse(storedUser);
                this.currentUserSubject.next(user);
                this.isAuthenticatedSubject.next(true);
            } catch (error) {
                this.logout();
            }
        }
    }


    login(email: string, password: string): Observable<{data : LoginResponse}> {
        return this.http.post<{data : LoginResponse}>('/auth/login', { email, password }).pipe(
            tap((response) => {
                this.storeAuthData(response.data); 
            }),
            catchError((error) => {
                this.logout(); 
                return throwError(() => error);
            })
        );
    }

    register(userData: RegisterRequest): Observable<User> {
        return this.http.post<User>('/auth/signup', userData);
    }

    logout(): void {
        this.clearAuthData(); 
        this.router.navigate(['/auth/login']);
        // this.http.post('/auth/logout', {}).subscribe({
        //     complete: () => {
       
        //     },
        // });
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    getAuthUser(): Observable<Partial<User> | null> {
        return this.currentUser$;
    }

    public storeAuthData(authData: LoginResponse): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, authData.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
        this.currentUserSubject.next(authData.user);
        this.isAuthenticatedSubject.next(true);
    }

    private clearAuthData(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
    }

    updateProfile(userId: string, updates: User): Observable<User> {
        return this.http.put<User>(`/users/${userId}`, updates);
    }

    resetPassword(email: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>('/auth/reset-password', { email });
    }

    checkAuth(): Observable<boolean> {
        const accessToken = this.getAccessToken();
        if (accessToken && this.isAuthenticated()) {
            return of(true); 
        } else {
            this.clearAuthData(); 
            return of(false);
        }
    }

     
}