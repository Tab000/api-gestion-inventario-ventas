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

export interface IClientRequest {
    name: string;
    document: string;
    address: string;
    phone: string;
    email: string;
    observations?: string;
}