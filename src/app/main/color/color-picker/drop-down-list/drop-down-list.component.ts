import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import {Color} from "../../../../../interface/color";
import {filter, fromEvent, Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownListComponent implements  AfterViewInit, OnDestroy {
  @Input() colorList: Color[] = [];
  @Output() selectedColor = new EventEmitter<string>()

  colorIndex = -1;

  private unsubscribe$ = new Subject<void>();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

  focusOnColor(index: number): void {
    this.colorIndex = index;
    this.selectedColor.emit(this.colorList[index].color);
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'ArrowDown'),
      tap(() => {
        this.colorIndex > this.colorList.length - 5 ? this.colorIndex -= this.colorList.length - 5 : this.colorIndex += 5;
        this.changeDetectorRef.markForCheck();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()

    fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'ArrowUp'),
      tap(() => {
        this.colorIndex < 5 ? this.colorIndex += this.colorList.length - 5 : this.colorIndex -= 5;
        this.changeDetectorRef.markForCheck();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()

    fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'ArrowRight'),
      tap(() => {
        this.colorIndex++;

        if(this.colorIndex === this.colorList.length) {
          this.colorIndex = 0;
        }

        this.changeDetectorRef.markForCheck();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()

    fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'ArrowLeft'),
      tap(() => {
        this.colorIndex--;

        if(this.colorIndex === -1) {
          this.colorIndex = this.colorList.length - 1;
        }

        this.changeDetectorRef.markForCheck();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
