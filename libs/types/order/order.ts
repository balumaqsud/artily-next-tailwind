import { Product, TotalCounter } from "../product/product";
import { OrderStatus } from "../../enums/order.enum";

export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;

  /** Relations / Aggregations **/
  orderItems?: OrderItem[];
  productData?: Product[];
}

export interface Orders {
  list: Order[];
  metaCounter: TotalCounter[];
}
