import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Slice} from "../interface/slice";
import {Post} from "../interface/post";

@Injectable({
  providedIn: 'root'
})
export class SliceListService {
  getSliceList(page: number, selectNumber: number): Slice {
    const begin = page * selectNumber;
    const end = page * selectNumber + selectNumber;

    return {begin, end};
  }
}
