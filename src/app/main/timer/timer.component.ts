import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap, timer } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  isShowButton = false;

  counter = 0;

  private unsubscribe$ = new Subject<number>();

  constructor() { }

  ngOnInit(): void {
  }

  submit(): void {
    console.log('before timer ',this.counter);
    timer(1000, 1000).pipe(
       tap(() => {
         this.counter += 1;
         this.isShowButton = true;
       }),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  pause(): void {
    this.isShowButton = false;
    this.unsubscribe$.next(this.counter);
  }

  reset(): void {
    this.isShowButton = false;
    this.counter = 0;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(0);
    this.unsubscribe$.complete();
  }

}
