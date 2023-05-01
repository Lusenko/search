import {Injectable} from '@angular/core';
import {TableHeader} from "../interface/table-header";
import {SortState} from "../enum/sort-state";
import {Posts} from "../interface/posts";

@Injectable({
  providedIn: 'root'
})
export class SortService {

  sortingTable(sortedState: TableHeader, dataList: Posts[]): Posts[] {
    switch (sortedState.sorted_state) {
      case SortState.default:
        return dataList.sort((a,b) => a.id > b.id ? 1 : -1);

      case SortState.up:
        return dataList.sort((a,b) => a[sortedState.head] > b[sortedState.head] ? 1 : -1);

      case SortState.down:
        return dataList.sort((a, b) => a[sortedState.head] < b[sortedState.head] ? 1 : -1)

      default:
        return dataList;
    }
  }

}
