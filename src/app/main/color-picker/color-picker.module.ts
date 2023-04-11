import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColorPickerRoutingModule} from './color-picker-routing.module';
import {ColorPickerComponent} from "./color-picker.component";
import { DropDownListComponent } from './drop-down-list/drop-down-list.component';


@NgModule({
  declarations: [ColorPickerComponent, DropDownListComponent],
  imports: [
    CommonModule,
    ColorPickerRoutingModule,
  ]
})
export class ColorPickerModule { }
