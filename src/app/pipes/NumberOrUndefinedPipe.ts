import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnumber',
})
export class NumberOrUndefinedPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if(value === undefined) return "-";

    return value.toString();
  }
}
