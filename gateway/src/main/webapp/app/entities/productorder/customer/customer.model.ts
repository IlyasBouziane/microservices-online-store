import { IProductOrder } from 'app/entities/productorder/product-order/product-order.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface ICustomer {
  id?: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  country?: string;
  orders?: IProductOrder[] | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public userId?: number,
    public firstName?: string,
    public lastName?: string,
    public gender?: Gender,
    public email?: string,
    public phone?: string,
    public addressLine1?: string,
    public addressLine2?: string | null,
    public city?: string,
    public country?: string,
    public orders?: IProductOrder[] | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
