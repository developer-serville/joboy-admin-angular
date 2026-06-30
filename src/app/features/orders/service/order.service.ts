import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService, HttpResponseModel } from '../../../core/services/base-http.service';
import { ResponseHandlerService } from '../../../core/services/response-handler.service';
import { CustomerList } from '../models/customer-list';
import { OrderCityList } from '../models/order-city-list';
import { OrderServiceList } from '../models/order-service-list.model';
import { OrderStatus } from '../models/order-status.model';
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

    addComment(data: { order_id: number; comment: string }): Observable<any> {

        return this.httpClient
            .post<HttpResponseModel<any>>(
                `${this.baseUrl}comments/save`,
                data
            )
            .pipe(
                map(response =>
                    this.responseHandlerService.validateResponse(response)
                )
            );

    }

    getOrderStatuses(): Observable<OrderStatus[]> {
        return this.httpClient
            .post<HttpResponseModel<OrderStatus[]>>(
                `${this.baseUrl}status/list`, {}
            )
            .pipe(
                map(response =>
                    this.responseHandlerService.validateResponse<OrderStatus[]>(
                        response,
                        false
                    ) ?? []
                )
            );

    }

    getCityList(): Observable<OrderCityList[]> {
        return this.httpClient
            .post<HttpResponseModel<OrderCityList[]>>(
                `${this.baseUrl}city/list`, {}
            )
            .pipe(
                map(response =>
                    this.responseHandlerService.validateResponse<OrderCityList[]>(
                        response,
                        false
                    ) ?? []
                )
            );

    }

    getServiceList(city_id: number): Observable<OrderServiceList[]> {
        return this.httpClient.post<HttpResponseModel<OrderServiceList[]>>(
            `${this.baseUrl}service/list`,
            {
                city_id: city_id
            }
        ).pipe(
            map(response =>
                this.responseHandlerService.validateResponse<OrderServiceList[]>(
                    response,
                    false
                ) ?? []
            )
        );
    }

    getCustomerList(item: string): Observable<CustomerList[]> {

        return this.httpClient
            .post<HttpResponseModel<CustomerList[]>>(
                `${this.baseUrl}customer/suggestedlist`,
                { item }
            )
            .pipe(
                map(response =>
                    this.responseHandlerService.validateResponse<CustomerList[]>(
                        response,
                        false
                    ) ?? []
                )
            );

    }
}