import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Slice} from "../interface/slice";

@Injectable({
  providedIn: 'root'
})
export class SliceListService<T> {
  private localPostList$ = new BehaviorSubject<T[]>([]);
  postList$ = this.localPostList$.asObservable();

  posts: T[] = [];

  setPostList(posts: T[]): void {
    this.posts = posts;
  }

  getPostList(sliceOperators: Slice): void {
    this.localPostList$.next(this.posts.slice(sliceOperators.begin, sliceOperators.end));
  }

  getSliceList(page: number, selectNumber: number): Slice {
    const begin = page * selectNumber;
    const end = page * selectNumber + selectNumber;

    return {begin, end};
  }
}
