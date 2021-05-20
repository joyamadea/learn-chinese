import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-level-pass',
  templateUrl: './level-pass.page.html',
  styleUrls: ['./level-pass.page.scss'],
})
export class LevelPassPage implements OnInit {

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {
  }

  
  closeModal() {
    this.router.navigate(['/category']);
    this.modalController.dismiss();
  }

}
