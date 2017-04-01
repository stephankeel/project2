import {Pipe, PipeTransform} from '@angular/core';
import {IBlindsData} from '../../../../../../server/entities/data.interface';

@Pipe({
  name: 'blindsPercentageDown'
})
export class BlindsPercentageDownPipe implements PipeTransform {

  transform(data: IBlindsData): number {
    if (data) {
      return data.percentageDown;
    } else {
      return null;
    }
  }
}
