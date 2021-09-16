import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BubblesComponent } from './components/bubbles/bubbles.component';
import { SoundsComponent } from './components/sounds/sounds.component';

const routes: Routes = [
  { path: '', component: BubblesComponent },
  { path: 'bubbles', component: BubblesComponent },
  { path: 'sounds', component: SoundsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
