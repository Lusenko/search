import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService<T> {

  constructor(private readonly http: HttpClient) { }

  getList$(): Observable<T[]> {
    return this.http.get<T[]>('https://jsonplaceholder.typicode.com/posts');
  }
}
