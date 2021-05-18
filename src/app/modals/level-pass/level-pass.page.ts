import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-level-pass',
  templateUrl: './level-pass.page.html',
  styleUrls: ['./level-pass.page.scss'],
})
export class LevelPassPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  
  closeModal() {
    this.modalController.dismiss();
  }

}
