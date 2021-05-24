import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmExitPage } from './confirm-exit.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmExitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmExitPageRoutingModule {}
