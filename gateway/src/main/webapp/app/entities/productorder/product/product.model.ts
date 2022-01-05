import { IProductCategory } from 'app/entities/productorder/product-category/product-category.model';
import { ProductSize } from 'app/entities/enumerations/product-size.model';

export interface IProduct {
  id?: number;
  sku?: string;
  upc?: string;
  name?: string;
  description?: string | null;
  price?: number;
  productSize?: ProductSize;
  colors?: string | null;
  imageContentType?: string | null;
  image?: string | null;
  imageSha1?: string | null;
  imageCdnUrl?: string | null;
  thumbnailSha1?: string | null;
  thumbnailCdnUrl?: string | null;
  productCategory?: IProductCategory | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public sku?: string,
    public upc?: string,
    public name?: string,
    public description?: string | null,
    public price?: number,
    public productSize?: ProductSize,
    public colors?: string | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public imageSha1?: string | null,
    public imageCdnUrl?: string | null,
    public thumbnailSha1?: string | null,
    public thumbnailCdnUrl?: string | null,
    public productCategory?: IProductCategory | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
