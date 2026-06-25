export interface LoginData {
    id: string;
    name: string;
    email: string;
    token: string;
}

export interface ApiResponse<T> {
    status: string;
    data: T;
    message: string;
}