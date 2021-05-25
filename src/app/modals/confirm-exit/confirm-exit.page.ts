import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-exit',
  templateUrl: './confirm-exit.page.html',
  styleUrls: ['./confirm-exit.page.scss'],
})
export class ConfirmExitPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  confirmExit() {
    this.router.navigate(['/category']);
    this.modalController.dismiss();
  }

  cancel() {
    this.modalController.dismiss();
  }
}
