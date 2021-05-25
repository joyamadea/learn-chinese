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

  closeModal() {
    this.router.navigate(['/category']);
    this.modalController.dismiss();
  }
}
