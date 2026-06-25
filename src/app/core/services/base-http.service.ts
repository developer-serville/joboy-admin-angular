import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import { GlobalErrorHandlerService } from "./global-error-handler/global-error-handler.service";



export interface HttpResponseModel<T> {
    status: string;
    message: string;
    data?: T;
}

export abstract class BaseHttpService {

    protected baseUrl = environment.apiUrl;

    constructor(
        protected httpClient: HttpClient,
    ) { }

    protected handleError(error: HttpErrorResponse, showSnackBar: boolean = true): Observable<never> {
        const errorHandler = inject(GlobalErrorHandlerService);
        return errorHandler.handleError(error, showSnackBar);
    }
}