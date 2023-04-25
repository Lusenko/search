import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from "./main.component";

const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'color',
    loadChildren: () => import('./color/color.module').then(m => m.ColorModule)
  },
  {
    path: 'timer',
    loadChildren: () => import('./timer/timer.module').then(m => m.TimerModule)
  },
  {
    path: 'highlight-list',
    loadChildren:  () => import('./highlight-list/highlight-list.module').then(m => m.HighlightListModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
