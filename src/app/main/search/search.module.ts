import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchRoutingModule} from './search-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {SearchComponent} from "./search.component";
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SearchModule { }
