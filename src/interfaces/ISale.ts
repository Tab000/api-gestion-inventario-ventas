export interface ISaleDetailRequest {
    product_id: number;
    quantity: number;
}

export interface ISaleRequest {
    client_id: number;
    products: ISaleDetailRequest[];
}

export interface ISaleHeader {
    id: number;
    client_id: number;
    sale_date: string;
    total: number;
    user_id: number;
    created_at: string;
}

export interface ISaleDetail {
    id: number;
    sale_id: number;
    product_id: number;
    quantity: number;
    subtotal: number;
}

export interface ISaleResponse extends ISaleHeader {
    details: ISaleDetail[];
}