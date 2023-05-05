import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Info} from "../interface/info";

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private readonly http: HttpClient) { }

  getInfo(search: string): Observable<Info> {
    return this.http.get<Info>(`https://chroniclingamerica.loc.gov/search/titles/results/?terms=${search}&format=json`);
  }
}
