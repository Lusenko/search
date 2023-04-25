import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { HighlightListComponent } from './highlight-list.component';

const routes: Routes = [
  {path: '', component: HighlightListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HighlightListRoutingModule { }
