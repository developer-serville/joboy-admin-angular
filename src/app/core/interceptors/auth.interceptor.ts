import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpRequest
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, finalize, throwError } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth/auth.service';
import { LoaderService } from '../services/loader.service';

export function AuthInterceptor(
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
) {

    const authService = inject(AuthService);
    const loaderService = inject(LoaderService);
    const router = inject(Router);

    loaderService.show();

    const token = authService.userToken;

    const clonedRequest = token
        ? request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : request;

    return next(clonedRequest).pipe(

        catchError((error: HttpErrorResponse) => {

            if (
                error.status === 401 ||
                error.status === 403
            ) {

                localStorage.removeItem('userData');

                router.navigate(['/login'], {
                    replaceUrl: true
                });
            }

            return throwError(() => error);
        }),

        finalize(() => {
            loaderService.hide();
        })
    );
}