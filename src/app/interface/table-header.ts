import {SortState} from "../enum/sort-state";

export interface TableHeader<T> {
  head: keyof T;
  sortedState: SortState;
}
