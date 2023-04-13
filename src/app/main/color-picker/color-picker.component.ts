import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Color} from "../../../interface/color";
import {filter, fromEvent, Subject, takeUntil, tap} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('arrow') arrow: ElementRef | undefined;

  isShowDropDown = false;

  selectedColor = '';

  color = new FormControl('#000000');

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
  ];

  private unsubscribe$ = new Subject<void>();

  addColor(color: string): void {
    this.selectedColor = color;
  }

  changeDropDownState(): void {
    this.isShowDropDown = !this.isShowDropDown;
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(this.arrow?.nativeElement, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'Enter'),
      tap(() => {
        this.isShowDropDown = !this.isShowDropDown;
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
