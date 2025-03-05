import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../pages/service/auth.service';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const messageService = inject(MessageService);

    const newReq = req.clone({
        url: environment.apiUrl + req.url,
        headers: req.headers.set('Authorization', authService.getAccessToken() || '')
    });

    return next(newReq).pipe(
        tap((response: any) => {
            console.log('Response:', response);
            if (response.body && response.body.message) {
                messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.body.message
                });
                
            }

        }),
        catchError((error: HttpErrorResponse) => {
            console.log('Error:', error);
            messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'An unexpected error occurred.'
            });
            return throwError(() => error);
        })
    );
};