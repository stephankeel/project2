import {Pipe, PipeTransform} from '@angular/core';
import {IAnalogData} from "../../../../../../server/entities/data.interface";
import {IDevice} from "../../../../../../server/entities/device.interface";

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(data: IDevice): string {
    if (data) {
      return data.name;
    }
    return null;
  }
}