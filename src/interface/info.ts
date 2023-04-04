import {Items} from "./items";

export interface Info {
  endIndex: number;
  items: Items[];
  itemsPerPage: number;
  startIndex: number;
  totalItems: number;
}
