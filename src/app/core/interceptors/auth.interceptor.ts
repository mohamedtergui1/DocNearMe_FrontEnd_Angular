import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../pages/service/auth.service';
import { inject } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoaderService } from '../services/loader.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const messageService = inject(MessageService);
    const loaderService = inject(LoaderService);
    loaderService.setLoading(true);
    const url = req.url.startsWith("http") ? req.url : environment.apiUrl + req.url;
    const header = authService.getAccessToken()
        ? {
            url: url,
            headers: req.headers.set('Authorization', 'Bearer ' + authService.getAccessToken())
        }
        : {
            url: environment.apiUrl + req.url
        };
    const newReq = req.clone(header);

    return next(newReq).pipe(
        tap((response: any) => {

            if (response.body && response.body.message) {
                messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.body.message
                });
            }
        }),
        catchError((error: HttpErrorResponse) => {
            console.error(error);
            messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error?.error?.message || 'An unexpected error occurred.'
            });
            return throwError(() => error);
        }),
        finalize(() => {
            loaderService.setLoading(false);
        })
    );
};
