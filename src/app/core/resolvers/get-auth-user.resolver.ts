import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { User } from '../../model/User';
import { catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../../pages/service/auth.service';
import { Router } from '@angular/router';

export const getAuthUserResolver: ResolveFn<User | null> = (route, state) => {
    const http = inject(HttpClient);
    const authService: AuthService = inject(AuthService);
    const router = inject(Router);
    
   
    return authService.getAuthUser().pipe(
        catchError((error) => {
            console.error('Error fetching auth user:', error);
            if (error.status === 404) {
                router.navigate(['/login']);
            }
            return of(null);
        }),
        switchMap((data: Partial<User> | null) => {
            if (data?.id) {
                const apiUrl = '/users/' + data.id;
                return http.get<User>(apiUrl).pipe(
                    catchError((error) => {
                        console.error('Error fetching user:', error);
                        if (error.status === 404) {
                            router.navigate(['/login']);
                        }
                        return of(null);
                    })
                );
            }
            return of(null); 
        })
    );
};
