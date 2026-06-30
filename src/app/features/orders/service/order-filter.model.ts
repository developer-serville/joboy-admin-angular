export interface OrderFilter {
    page: number;
    limit: number;
    status: string;
    order_id: string;
    customer: string;
    from_date: string;
    to_date: string;
    city: number | null;
    cat_id: number | null;
    search: string;
    type: string;
}