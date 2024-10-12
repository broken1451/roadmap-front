import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortAlphabetic',
  standalone: true
})
export class SortAlphabeticPipe implements PipeTransform {

  transform(value: any, order: string = 'Ascending') {
    // console.log({ value, order });
  
    if (order) {
      value?.sort(function (a: any, b: any) {
        if (order === 'Ascending') {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
        } else {
          if (a.title > b.title) {
            return -1;
          }
          if (a.title < b.title) {
            return 1;
          }
        }
        return 0;
      });
    }
    return value;
  }

}
