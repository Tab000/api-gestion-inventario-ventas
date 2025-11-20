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

export type ISale = ISaleResponse;

export interface IClient {
    id: number;
    name: string;
    document: string;
    address: string;
    phone: string;
    email: string;
    created_at: string;
    observations?: string;
}

export interface IProduct {
    id: number;
    code_sku: string;
    name: string;
    category: string;
    price_unit: number;
    cost_unit: number;
    stock_actual: number;
    stock_minimo: number;
    location: string;
    alert_stock: boolean;
    created_at: string;
}

