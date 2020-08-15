import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'customers',
    loadChildren: async () => (await import('./customers/customers.module')).CustomersModule,
  },{
    path: 'products',
    loadChildren: async () => (await import('./products/products.module')).ProductsModule,
  },{ path: '', pathMatch: 'full', redirectTo: 'lazy' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
