import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColorPickerRoutingModule} from './color-picker-routing.module';
import {ColorPickerComponent} from "./color-picker.component";


@NgModule({
  declarations: [ColorPickerComponent],
  imports: [
    CommonModule,
    ColorPickerRoutingModule,
  ]
})
export class ColorPickerModule { }
