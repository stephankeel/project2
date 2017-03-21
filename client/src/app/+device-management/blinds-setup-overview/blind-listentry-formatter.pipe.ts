import {Pipe, PipeTransform} from '@angular/core';
import {IBlindsDevice} from "../../../../../server/entities/device.interface";

@Pipe({
  name: 'blindListentryFormatter'
})
export class BlindListentryFormatterPipe implements PipeTransform {
  transform(blind: IBlindsDevice): string {
    return `${blind.name}`;
  }
}
