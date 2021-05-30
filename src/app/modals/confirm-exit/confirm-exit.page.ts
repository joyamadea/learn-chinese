import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-exit',
  templateUrl: './confirm-exit.page.html',
  styleUrls: ['./confirm-exit.page.scss'],
})
export class ConfirmExitPage implements OnInit {
  @Input() type;

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.type);
  }

  confirmExit() {
    if (this.type == 'practice') {
      this.router.navigate(['/category/practice']);
    } else if (this.type == 'test') {
      this.router.navigate(['/category/test']);
    } else if (this.type == 'learn') {
      this.router.navigate(['/category/learn']);
    }

    this.modalController.dismiss();
  }

  cancel() {
    this.modalController.dismiss();
  }
}
