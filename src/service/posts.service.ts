import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Posts} from "../interface/posts";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private readonly http: HttpClient) { }

  getPostsInfo(): Observable<Posts[]> {
    return this.http.get<Posts[]>('https://jsonplaceholder.typicode.com/posts');
  }
}
