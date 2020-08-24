import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '../translate/i18n/i18n.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsDetailComponent } from './products-detail/products-detail.component';
import { PipesModule } from '../pipes/pipes.module';
import {MatRadioModule} from '@angular/material/radio';
import { DirectivesModule } from '../directives/directive.module';
import {MatSliderModule} from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import { PreCreateProductComponent } from './pre-create-product/pre-create-product.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

const routes: Routes = [
  {
    path: 'list',
    component: ProductsListComponent,
  },{
    path: 'detail/:id',
    component: ProductsDetailComponent,
  },{
    path: 'new',
    component: PreCreateProductComponent,
  }
];
@NgModule({
  declarations: [
    ProductsListComponent,
    ProductsDetailComponent,
    PreCreateProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    PipesModule,
    DirectivesModule,
    MatSliderModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule,
    MatGridListModule,
    MatChipsModule,
    MatAutocompleteModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    I18nModule
  ],
  providers: [
    MatDatepickerModule,
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}
  ],
  entryComponents: [
  ]
})
export class ProductsModule { }
