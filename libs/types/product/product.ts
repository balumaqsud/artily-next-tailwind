import {
  ProductType,
  ProductStatus,
  SHippingTimeType,
} from "../../enums/product.enum";
import { Member } from "../member/member";
import { ObjectId } from "mongoose";

export interface MeLiked {
  memberId: string;
  likeRefId: string;
  myFavorite: boolean;
}

export interface TotalCounter {
  total: number;
}

export interface Product {
  _id: ObjectId;
  productType: ProductType;
  productCategory: string;
  productStatus: ProductStatus;
  productTags?: [string];
  productLocation: string;
  productShippingTime: SHippingTimeType;
  productTitle: string;
  productPrice: number;
  productViews: number;
  productLikes: number;
  productComments: number;
  productRank: number;
  productImages: [string];
  productMaterials: [string];
  productColor: [string];
  productDesc?: string;
  productShippingCost?: number;
  productWrapAvailable?: boolean;
  productPersonalizable?: boolean;
  productStock: number;
  productSlug: string;
  memberId: ObjectId;
  soldAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  /** from aggregation **/
  meLiked?: MeLiked[];
  memberData?: Member;
}

export interface Products {
  list: Product[];
  metaCounter: TotalCounter[];
}
