import {Injectable} from '@angular/core';
import {TableHeader} from "../interface/table-header";
import {SortState} from "../enum/sort-state";
import {Post} from "../interface/post";

@Injectable({
  providedIn: 'root'
})
export class SortService {

  sortTable(header: TableHeader<Post>, list: Post[]): Post[] {
    switch (header.sortedState) {
      case SortState.default:
        return list.sort((a,b) => {
          const key = header.head as keyof Post;

          return a[key] > b[key] ? 1 : -1;
        });

      case SortState.up:
        return list.sort((a,b) => {
          const key = header.head as keyof Post;

          return  a[key] > b[key] ? 1 : -1;
        });

      case SortState.down:
        return list.sort((a, b) => {
          const key = header.head as keyof Post;

          return a[key] < b[key] ? 1 : -1;
        })

      default:
        return list;
    }
  }

}
