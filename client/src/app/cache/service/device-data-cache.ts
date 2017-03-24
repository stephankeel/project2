import {IId} from "../../../../../server/entities/id.interface";
import {Observable} from "rxjs";
import {GenericDataService} from "../../remote/generic-data.service";
export class DeviceDataCache<T extends IId> {
  private registered: boolean;
  private allValuesLoaded: boolean;
  private dataService: GenericDataService<T>;

  constructor(private createDataService: (id: string) => GenericDataService<T>, private id: string) {
  }

  public getLatest(): Observable<T> {
    if (!this.registered) {
      this.register();
      this.dataService.getLatest();
    }
    return this.dataService.lastItem;
  }

  public getAll(): Observable<T[]> {
    if (!this.allValuesLoaded) {
      if (!this.registered) {
        this.register();
      }
      this.dataService.getAll();
      this.allValuesLoaded = true;
    }
    return this.dataService.items;
  }

  private register() {
    this.dataService = this.createDataService(this.id);
    this.registered = true;
  }

  public unregister() {
    this.dataService.disconnect();
  }
}
