import { ProductStatus, ProductType } from "../../enums/product.enum";

export interface ProductUpdate {
  _id: string;
  productType?: ProductType;
  productCategory?: string;
  productStatus?: ProductStatus;
  productTags?: string[];
  productLocation?: string;
  productTitle?: string;
  productPrice?: number;
  productImages?: string[];
  productMaterials?: string[];
  productColor?: string[];
  productDesc?: string;
  productShippingCost?: number;
  productWrapAvailable?: boolean;
  productPersonalizable?: boolean;
  productStock?: number;
  productSlug?: string;
  soldAt?: Date;
  deletedAt?: Date;
}
