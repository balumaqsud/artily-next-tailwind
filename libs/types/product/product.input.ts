import {
  ProductType,
  ProductStatus,
  SHippingTimeType,
} from "../../enums/product.enum";
import { Direction } from "../../enums/common.enum";

export interface ProductInput {
  productType: ProductType;
  productCategory: string;
  productLocation: string;
  productShippingTime: SHippingTimeType;
  productTitle: string;
  productPrice: number;
  productImages: string[];
  productMaterials: string[];
  productTags: string[];
  productStock: number;
  productColor?: string[];
  productDesc?: string;
  productShippingCost?: number;
  productWrapAvailable?: boolean;
  productPersonalizable?: boolean;
  memberId?: string;
}

interface PricesRange {
  start: number;
  end: number;
}

interface PeriodsRange {
  start: Date;
  end: Date;
}

interface PISearch {
  memberId?: string;
  productLocation?: string;
  productTags?: string;
  pricesRange?: PricesRange;
  periodsRange?: PeriodsRange;
  typeList?: ProductType[];
  text?: string;
}

export interface ProductsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: PISearch;
}

interface APISearch {
  productStatus?: ProductStatus;
  productTitle?: string;
  productLocation?: string;
  productCategory?: string;
  productRank?: number;
  pricesRange?: PricesRange;
}

export interface SellerProductsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: APISearch;
}

interface ALPISearch {
  productStatus?: ProductStatus;
  productLocation?: string;
  productTitle?: string;
  productCategory?: string;
  typeList?: ProductType[];
  pricesRange?: PricesRange;
  productRank?: number;
}

export interface AllProductsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: ALPISearch;
}

export interface OrdinaryInquiry {
  page: number;
  limit: number;
}
