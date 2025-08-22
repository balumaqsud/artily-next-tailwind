import { OrderStatus } from "../../enums/order.enum";

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: string;
  orderId?: string;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus?: OrderStatus;
}
