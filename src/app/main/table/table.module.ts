import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableRoutingModule } from './table-routing.module';
import { TableComponent } from "./table.component";
import { HeaderComponent } from './header/header.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [ TableComponent, HeaderComponent ],
  imports: [
    CommonModule,
    TableRoutingModule,
    ReactiveFormsModule
  ]
})
export class TableModule { }
