import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Color} from "../../../../interface/color";
import {filter, fromEvent, Subject, takeUntil, tap} from "rxjs";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropDownListComponent,
      multi: true
    }
  ]
})
export class DropDownListComponent implements  AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() colorList: Color[] = [];
  @Output() selectedColor = new EventEmitter<string>();

  colorIndex = -1;

  color = '';

  private unsubscribe$ = new Subject<void>();

  constructor() { }

  onTouched: () => void = () => {};
  onChange: (() => (value: string) => {}) | undefined;

  focusOnColor(index: number): void {
    this.colorIndex = index;
    this.color = this.colorList[index].color
    this.selectedColor.emit(this.color);
  }

  writeValue(color: string): void {
    this.color = color;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'ArrowDown'),
      tap(() => {
        this.colorIndex > this.colorList.length - 5 ? this.colorIndex -= this.colorList.length - 5 : this.colorIndex += 5;
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()

    fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'ArrowUp'),
      tap(() => {
        this.colorIndex < 5 ? this.colorIndex += this.colorList.length - 5 : this.colorIndex -= 5;
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
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
