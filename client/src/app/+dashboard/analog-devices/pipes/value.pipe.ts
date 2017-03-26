import {Pipe, PipeTransform} from '@angular/core';
import {IAnalogData} from  '../../../../../../server/entities/data.interface'

@Pipe({
  name: 'value'
})
export class ValuePipe implements PipeTransform {

  transform(data: IAnalogData): number {
    if (data) {
      return data.value;
    }
    return null;
  }
}
