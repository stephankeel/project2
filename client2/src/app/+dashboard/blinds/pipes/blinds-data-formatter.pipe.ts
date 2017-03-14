import { Pipe, PipeTransform } from '@angular/core';
import {IBlindsData} from '../../../../../../server/entities/data.interface';
import {blindsStateAsString} from '../../../../../../server/entities/blinds-state';

@Pipe({
  name: 'blindsDataFormatter'
})
export class BlindsDataFormatterPipe implements PipeTransform {

  transform(data: IBlindsData): string {
    if (data) {
      return `${blindsStateAsString(data.state)} @ ${data.percentageDown}% down @ ${new Date(data.timestamp).toLocaleTimeString()}`;
    } else {
      return 'State not available';
    }
  }

}
