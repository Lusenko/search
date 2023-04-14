import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorRoutingModule } from './color-routing.module';
import {ColorComponent} from "./color.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ColorPickerComponent} from "./color-picker/color-picker.component";
import {DropDownListComponent} from "./color-picker/drop-down-list/drop-down-list.component";



@NgModule({
  declarations: [ColorComponent, ColorPickerComponent, DropDownListComponent],
  imports: [
    CommonModule,
    ColorRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ColorModule { }
