import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { ResponseHandlerService } from '../../../core/services/response-handler.service';
import { OrderFilter } from './order-filter.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService extends BaseHttpService {

    constructor(
        protected override httpClient: HttpClient,
        private responseHandlerService: ResponseHandlerService
    ) {
        super(httpClient);
    }

    getOrders(filter: OrderFilter): Observable<any> {

        return this.httpClient.post<any>(
            `${this.baseUrl}order/list`,
            filter
        );

    }

}