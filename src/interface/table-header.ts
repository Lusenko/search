import {SortState} from "../enum/sort-state";
import {Posts} from "./posts";

export interface TableHeader {
  head: keyof Posts;
  sorted_state: SortState;
}
