import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, switchMap, takeUntil, tap } from 'rxjs';
import { Phone } from 'src/interface/phone';
import { PhoneInfoService } from 'src/service/phoneInfo';

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
      switchMap(() => this.phoneService.getPhoneInfo().pipe(
        tap(x => {
          this.isShowDropDown = true;
          this.phoneList = x;
          this.changeDetectorRef.markForCheck();
        }
        ),
      )),
      takeUntil(this.subscribe$),
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.subscribe$.next();
    this.subscribe$.complete();
  }

}
