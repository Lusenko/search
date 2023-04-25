import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Phone } from 'src/interface/phone';

@Injectable({
  providedIn: 'root'
})
export class PhoneInfoService {

  constructor(private readonly http: HttpClient) { }

  getPhoneInfo(): Observable<Phone[]> {
    return this.http.get<Phone[]>(`assets/data/mock-phone.json`);
  }
}