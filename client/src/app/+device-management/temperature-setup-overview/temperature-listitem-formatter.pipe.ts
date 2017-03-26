import {Pipe, PipeTransform} from "@angular/core";
import {ITemperatureDevice} from "../../../../../server/entities/device.interface";

@Pipe({
  name: 'temperatureListitemFormatter'
})
export class TemperatureListitemFormatterPipe implements PipeTransform {

  transform(temperature: ITemperatureDevice): string {
    if (temperature) {
      return temperature.name;
    }
    return null;
  }
}
