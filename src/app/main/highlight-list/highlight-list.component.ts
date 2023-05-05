import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { Phone } from 'src/app/interface/phone';
import { PhoneInfoService } from 'src/app/service/phoneInfo';

@Component({
  selector: 'app-highlight-list',
  templateUrl: './highlight-list.component.html',
  styleUrls: ['./highlight-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightListComponent implements OnInit, OnDestroy {

  search = new FormControl('', {nonNullable: true});

  phoneList: Phone[] = [];

  isShowDropDown = false;

  private subscribe$ = new Subject<void>();

  constructor(private readonly phoneService: PhoneInfoService, private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.search.valueChanges.pipe(
      debounceTime(600),
      filter(val => val !== ''),
      switchMap(() => this.phoneService.getPhoneInfo()),
      map(val => val.filter(value => value.name.toLocaleLowerCase().includes(this.search.value))),
      tap(value => {
        this.isShowDropDown = true;
        this.phoneList = value;
        this.changeDetectorRef.markForCheck();
      }),
      takeUntil(this.subscribe$),
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.subscribe$.next();
    this.subscribe$.complete();
  }

}
