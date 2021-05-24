import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmExitPageRoutingModule } from './confirm-exit-routing.module';

import { ConfirmExitPage } from './confirm-exit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmExitPageRoutingModule
  ],
  declarations: [ConfirmExitPage]
})
export class ConfirmExitPageModule {}
