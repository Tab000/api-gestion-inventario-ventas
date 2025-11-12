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

export interface IProductRequest {
    code_sku: string;
    name: string;
    category: string;
    price_unit: number;
    cost_unit: number;
    stock_actual: number;
    stock_minimo: number;
    location: string;
}