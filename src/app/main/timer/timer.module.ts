import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { TimerComponent } from './timer.component';
import { TimerRoutingModule } from './timer-routing.module';

@NgModule({
  declarations: [TimerComponent],
  imports: [
    CommonModule,
    TimerRoutingModule,
  ]
})
export class TimerModule { }
