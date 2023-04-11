import { Component, OnInit } from '@angular/core';
import {Color} from "../../../interface/color";

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  isShowDropDown = false;

  selectedColor = '';

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

  constructor() { }

  addColor(color: string): void {
    this.selectedColor = color;
  }

  ngOnInit(): void {
  }

  changeDropDownState(): void {
    this.isShowDropDown = !this.isShowDropDown;
  }

}
