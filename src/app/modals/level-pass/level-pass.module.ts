import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LevelPassPageRoutingModule } from './level-pass-routing.module';

import { LevelPassPage } from './level-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LevelPassPageRoutingModule
  ],
  declarations: [LevelPassPage]
})
export class LevelPassPageModule {}
