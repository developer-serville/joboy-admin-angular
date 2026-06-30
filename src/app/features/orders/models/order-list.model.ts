export interface OrderNote {
    order_id: string;
    activity: string;
    comments: string;
    name: string;
    type_id: number;
    type: string | null;
    date: string | null;
}

export interface Order {
    order_id: number;
    order_no: string;
    service: string;
    city: string;
    customer_name: string;
    customer_mobile: string;
    provider_name: string;
    provider_mobile: string;
    created_on: string;
    booking_type: string;
    status: string;
    status_code: number;
    transaction_status: number;
    working_play_status: number;
    scheduled_date: string;

    note: OrderNote;
}

export interface OrderListResponse {
    status: string;
    data: Order[];
    recordsTotal: number;
    recordsFiltered: number;
}