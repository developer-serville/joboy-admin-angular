import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { BaseHttpService, HttpResponseModel } from '../../../../core/services/base-http.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { ResponseHandlerService } from '../../../../core/services/response-handler.service';
import { LoginData } from '../../models/login.model';
import { ProfileData } from '../../models/profile.model';



@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseHttpService {

    constructor(
        protected override httpClient: HttpClient,
        private router: Router,
        private responseHandlerService: ResponseHandlerService,
        private loaderService: LoaderService
    ) {
        super(httpClient);
    }

    userSignIn(
        username: string,
        password: string
    ): Observable<LoginData | null> {

        return this.httpClient
            .post<HttpResponseModel<LoginData>>(
                `${this.baseUrl}login`,
                {
                    username,
                    password
                }
            )
            .pipe(
                map((response) =>
                    this.responseHandlerService
                        .validateResponse<LoginData>(response)
                ),
                tap((userData) => {

                    if (userData) {
                        this.saveUserDataToLocal(userData);
                    }
                })
            );
    }

    private saveUserDataToLocal(
        userData: LoginData
    ): void {

        localStorage.setItem(
            'userData',
            JSON.stringify(userData)
        );
    }

    get userToken(): string | null {
        const userData = this.loadUserDataFromLocalStorage();
        return userData ? userData.token : null;
    }

    private loadUserDataFromLocalStorage(): LoginData | null {
        const userData = localStorage.getItem('userData');
        if (userData) {
            return JSON.parse(userData);
        }
        return null;
    }

    get isAuthenticated(): boolean {
        return !!this.loadUserDataFromLocalStorage();
    }

    private clearSession(): void {
        localStorage.removeItem('userData');

        this.router.navigate(['/login'], {
            replaceUrl: true
        });
    }

    logout(): void {

        const userData =
            this.loadUserDataFromLocalStorage();

        this.httpClient
            .post<HttpResponseModel<any>>(
                `${this.baseUrl}logout`,
                {
                    user_id: userData?.id
                }
            )
            .subscribe({
                next: (response) => {
                    if (response.status === 'success') {
                        this.responseHandlerService
                            .showSuccessMessage(
                                response.message
                            );

                        this.clearSession();

                    } else {

                        this.responseHandlerService
                            .showMessage(
                                response.message
                            );
                    }
                },
                error: () => {

                    this.responseHandlerService
                        .showMessage(
                            'Logout failed.'
                        );
                }
            });
    }

    getProfile(): Observable<ProfileData | null> {

        const userData =
            this.loadUserDataFromLocalStorage();

        return this.httpClient
            .post<HttpResponseModel<ProfileData>>(
                `${this.baseUrl}profile/view`,
                {
                    user_id: userData?.id
                }
            )
            .pipe(
                map(response =>
                    this.responseHandlerService
                        .validateResponse<ProfileData>(
                            response,
                            false
                        )
                )
            );
    }

    updateProfile(
        firstname: string,
        lastname: string,
        email: string,
        mobile: string
    ): Observable<any> {

        return this.httpClient
            .post<HttpResponseModel<any>>(
                `${this.baseUrl}profile/edit`,
                {
                    firstname,
                    lastname,
                    email,
                    mobile
                }
            )
            .pipe(
                map(response =>
                    this.responseHandlerService
                        .validateResponse(response)
                )
            );
    }
}