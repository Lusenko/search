import { Injectable } from '@angular/core';
import {Slice} from "../interface/slice";

@Injectable({
  providedIn: 'root'
})
export class SliceListService {
  getSlice(page: number, selectNumber: number): Slice {
    const begin = page * selectNumber;
    const end = page * selectNumber + selectNumber;

    return {begin, end};
  }
}
