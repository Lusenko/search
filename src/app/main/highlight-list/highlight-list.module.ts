import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { HighlightListComponent } from './highlight-list.component';
import { HighlightListRoutingModule } from './highlight-list-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HighlightDirective } from 'src/app/shared/highlight.directive';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [HighlightListComponent],
  imports: [
    CommonModule,
    HighlightListRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class HighlightListModule { }