import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomersDetailComponent } from './customers-detail/customers-detail.component';
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
import { CheckNullPipe } from '../pipes/check-null.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmDialog } from '../dialogs/confirm-dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: 'list',
    component: CustomersListComponent,
  },{
    path: 'detail/:id',
    component: CustomersDetailComponent,
  },
];

@NgModule({
  declarations: [
    CustomersListComponent, 
    CustomersDetailComponent,
    ConfirmDialog
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
    PipesModule,
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
export class CustomersModule { }
