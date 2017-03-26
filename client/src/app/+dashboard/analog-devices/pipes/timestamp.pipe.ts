import {Pipe, PipeTransform} from '@angular/core';
import {IAnalogData} from  '../../../../../../server/entities/data.interface'

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(data: IAnalogData): number {
    if (data) {
      return data.timestamp;
    }
    return null;
  }
}
