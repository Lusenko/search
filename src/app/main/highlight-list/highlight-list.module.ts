import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { HighlightListComponent } from './highlight-list.component';
import { HighlightListRoutingModule } from './highlight-list-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HighlightDirective } from 'src/app/shared/highlight.directive';

@NgModule({
  declarations: [HighlightListComponent, HighlightDirective],
  imports: [
    CommonModule,
    HighlightListRoutingModule,
    ReactiveFormsModule,
  ]
})
export class HighlightListModule { }