import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Post} from "../interface/post";
import {Slice} from "../interface/slice";

@Injectable({
  providedIn: 'root'
})
export class SliceListService {
  private localPostList$ = new BehaviorSubject<Post[]>([]);
  postList$ = this.localPostList$.asObservable();

  posts: Post[] = [];

  setPostList(posts: Post[]): void {
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
