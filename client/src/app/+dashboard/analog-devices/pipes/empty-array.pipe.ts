import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'emptyArray'
})
export class EmptyArrayPipe implements PipeTransform {

  transform(values: any[]): boolean {
    return values && values.length === 0;
  }
}
