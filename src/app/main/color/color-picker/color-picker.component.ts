import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {Color} from "../../../interface/color";
import {filter, fromEvent, Subject, takeUntil, tap} from "rxjs";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ColorPickerComponent,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('arrow') arrow: ElementRef | undefined;
  @ViewChild('dropDownList') dropDownList: ElementRef | undefined;

  isShowDropDown = false;

  color = '';

  colorList: Color[] = [
    {color: '#000000'},
    {color: '#424242'},
    {color: '#9E9E9E'},
    {color: '#E0E0E0'},
    {color: '#FFFFFF'},
    {color: '#B71C1C'},
    {color: '#C62828'},
    {color: '#F44336'},
    {color: '#EF9A9A'},
    {color: '#FFCDD2'},
    {color: '#F57F17'},
    {color: '#F9A825'},
    {color: '#FBC02D'},
    {color: '#FFEE58'},
    {color: '#FFF9C4'},
    {color: '#1B5E20'},
    {color: '#2E7D32'},
    {color: '#43A047'},
    {color: '#81C784'},
    {color: '#C8E6C9'},
    {color: '#0D47A1'},
    {color: '#1565C0'},
    {color: '#1976D2'},
    {color: '#2196F3'},
    {color: '#BBDEFB'},
    {color: '#4A148C'},
    {color: '#6A1B9A'},
    {color: '#8E24AA'},
    {color: '#BA68C8'},
    {color: '#E1BEE7'},
    {color: '0000000'}
  ];

  private onChange: Function = () => {};
  private onTouched: Function = () => {};
  private unsubscribe$ = new Subject<void>();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  writeValue(color: string): void {
    this.color = color;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  addColor(color: string): void {
    this.color = color;
    this.onChange(color);
    this.isShowDropDown = false;
  }

  changeDropDownState(): void {
    this.isShowDropDown = !this.isShowDropDown;
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(this.arrow?.nativeElement, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'Enter'),
      tap(() => {
        this.changeDropDownState()
        this.changeDetectorRef.markForCheck();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()

   fromEvent(window, 'click').pipe(
      filter(e => e.target !== this.dropDownList?.nativeElement && e.target !== this.arrow?.nativeElement),
      tap(() => {
        this.isShowDropDown = false;
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
