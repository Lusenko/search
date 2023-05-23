import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import {MapComponent} from "./map.component";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [MapComponent],
    imports: [
        CommonModule,
        MapRoutingModule,
        ReactiveFormsModule
    ]
})
export class MapModule { }
