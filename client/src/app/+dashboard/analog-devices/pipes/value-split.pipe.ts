import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'valueSplit'
})
export class ValueSplitPipe implements PipeTransform {

  /**
   * Splits the value depending on the option in pre- or post-decimalpoint part
   * @param value
   * @param option if empty or > 0, to cut decimals. Use 0 the full value is returned, use -1 or < 0 to just return the decimal part (rounded to one digit)
   * @returns {number} the value ot parts of it depending on the option
   */
  transform(value: number, option?: number): number {
    if (value) {
      if (option && option > 0) {
        return Math.floor(value);
      } else if (option && option < 0) {
        return Math.round((value - Math.floor(value)) * 10);
      }
      return value;
    }
    return null;
  }
}
