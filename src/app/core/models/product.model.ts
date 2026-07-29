export interface ProductRequestModel {
    productName: string;
    description: string;
    sku: string;
    price: number;
    stockQuantity: number;
    productCategoryId: number;
    merchantId?: number | null;
}

export interface ProductResponseModel {
    id: number;
    productName: string;
    description: string;
    sku: string;
    price: number;
    stockQuantity: number;
    isActive: boolean;
    productCategoryId: number;
    productCategoryName: string;
    merchantId: number | null;
    merchantName: string | null;
}
