import * as dayjs from 'dayjs';
import { IOrderItem } from 'app/entities/productorder/order-item/order-item.model';
import { ICustomer } from 'app/entities/productorder/customer/customer.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

export interface IProductOrder {
  id?: number;
  placedDate?: dayjs.Dayjs;
  status?: OrderStatus;
  invoiceId?: number | null;
  code?: string;
  orderItems?: IOrderItem[] | null;
  customer?: ICustomer | null;
}

export class ProductOrder implements IProductOrder {
  constructor(
    public id?: number,
    public placedDate?: dayjs.Dayjs,
    public status?: OrderStatus,
    public invoiceId?: number | null,
    public code?: string,
    public orderItems?: IOrderItem[] | null,
    public customer?: ICustomer | null
  ) {}
}

export function getProductOrderIdentifier(productOrder: IProductOrder): number | undefined {
  return productOrder.id;
}
