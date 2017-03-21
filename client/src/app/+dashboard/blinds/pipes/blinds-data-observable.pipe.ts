import {Pipe, PipeTransform} from "@angular/core";
import {Observable} from "rxjs";
import {BlindsDevice} from '../../../misc/device-pool';
import {IBlindsData} from "../../../../../../server/entities/data.interface";

@Pipe({
  name: 'blindsDataObservable'
})
export class BlindsDataObservablePipe implements PipeTransform {

  transform(device: BlindsDevice, devicesState: Map<BlindsDevice, Observable<IBlindsData>>): Observable<IBlindsData> {
    return devicesState.get(device);
  }

}
