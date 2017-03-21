import { Pipe, PipeTransform } from '@angular/core';
import {IHumidityDevice} from "../../../../../server/entities/device.interface";

@Pipe({
  name: 'humidityListitemFormatter'
})
export class HumidityListitemFormatterPipe implements PipeTransform {

  transform(humidity: IHumidityDevice): string {
    return `${humidity.name}`;
  }

}
