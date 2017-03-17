import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timestampFormatter'
})
export class TimestampFormatterPipe implements PipeTransform {

  transform(timestamp: number): string {
    if (timestamp) {
      return `${new Date(timestamp).toLocaleTimeString()}`;
    } else {
      return 'time missing';
    }
  }

}
