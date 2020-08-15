import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkNull'
})
export class CheckNullPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value == null || value == '')
            return '  -  -  -  ';
        else
            return value;
  }

}
