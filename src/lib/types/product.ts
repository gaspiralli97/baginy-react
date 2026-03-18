import { ProductCollection, ProductSize, ProductStatus } from "../enums/product.enum";

export interface Product{
    _id: string;
    productStatus: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize: ProductSize;
    productVolume: number;
    productDesc?: string;
    productImages: string[];
    productViews: number;

    updatedAt:Date;
    createdAt:Date;
}

export interface ProductInquiry{
    order:string;
    limit: number;
    page: number;
    productCollection?:ProductCollection;
    search?:string;

}