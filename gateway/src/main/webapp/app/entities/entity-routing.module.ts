import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        data: { pageTitle: 'gatewayApp.productorderProduct.home.title' },
        loadChildren: () => import('./productorder/product/product.module').then(m => m.ProductorderProductModule),
      },
      {
        path: 'product-category',
        data: { pageTitle: 'gatewayApp.productorderProductCategory.home.title' },
        loadChildren: () =>
          import('./productorder/product-category/product-category.module').then(m => m.ProductorderProductCategoryModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'gatewayApp.productorderCustomer.home.title' },
        loadChildren: () => import('./productorder/customer/customer.module').then(m => m.ProductorderCustomerModule),
      },
      {
        path: 'product-order',
        data: { pageTitle: 'gatewayApp.productorderProductOrder.home.title' },
        loadChildren: () => import('./productorder/product-order/product-order.module').then(m => m.ProductorderProductOrderModule),
      },
      {
        path: 'order-item',
        data: { pageTitle: 'gatewayApp.productorderOrderItem.home.title' },
        loadChildren: () => import('./productorder/order-item/order-item.module').then(m => m.ProductorderOrderItemModule),
      },
      {
        path: 'invoice',
        data: { pageTitle: 'gatewayApp.invoiceInvoice.home.title' },
        loadChildren: () => import('./invoice/invoice/invoice.module').then(m => m.InvoiceInvoiceModule),
      },
      {
        path: 'shipment',
        data: { pageTitle: 'gatewayApp.invoiceShipment.home.title' },
        loadChildren: () => import('./invoice/shipment/shipment.module').then(m => m.InvoiceShipmentModule),
      },
      {
        path: 'notification',
        data: { pageTitle: 'gatewayApp.notificationNotification.home.title' },
        loadChildren: () => import('./notification/notification/notification.module').then(m => m.NotificationNotificationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
