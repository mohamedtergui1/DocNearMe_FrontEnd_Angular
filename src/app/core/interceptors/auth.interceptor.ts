import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../../environments/environment.development'; 
import { AuthService } from '../../pages/service/auth.service';
import { inject } from '@angular/core';
import { catchError, tap, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService: AuthService = inject(AuthService);
    
    const newReq = req.clone({
        url: environment.apiUrl + req.url,
        headers: req.headers.set('Authorization', authService.getToken() || '')
    });
     
    return next(newReq).pipe(
        tap((response: any) => {
             
        }),
        catchError((error: HttpErrorResponse) => {
            
            return throwError(() => error);
        }),
        finalize(() => {})
    );
};
