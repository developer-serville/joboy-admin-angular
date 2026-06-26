export interface OrderFilter {
    page: number;
    limit: number;
    status: number;
    order_id: string;
    customer: string;
    from_date: string;
    to_date: string;
    city: string;
    cat_id: number[];
    search: string;
}