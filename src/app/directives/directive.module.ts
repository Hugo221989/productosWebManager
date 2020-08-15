import { NumericDirective } from './numeric.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [NumericDirective],
    imports: [
      CommonModule
    ],
    exports: [
        NumericDirective
    ]
  })
  export class DirectivesModule { }