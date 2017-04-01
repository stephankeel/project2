import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'notEmptyArray'
})
export class NotEmptyArrayPipe implements PipeTransform {

  transform(value: any[]): boolean {
    return value && value.length > 0;
  }
}
