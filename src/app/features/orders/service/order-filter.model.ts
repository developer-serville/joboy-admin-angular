export interface OrderFilter {
    page: number;
    limit: number;
    status: string;
    order_id: string;
    customer: string;
    from_date: string;
    to_date: string;
    city: string;
    cat_id: string;
    search: string;
    type: string;
}