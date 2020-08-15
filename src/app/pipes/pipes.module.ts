import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckNullPipe } from './check-null.pipe';



@NgModule({
  declarations: [CheckNullPipe],
  imports: [
    CommonModule
  ],
  exports: [
    CheckNullPipe
  ]
})
export class PipesModule { }
