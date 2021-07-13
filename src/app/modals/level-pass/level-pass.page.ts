import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-level-pass',
  templateUrl: './level-pass.page.html',
  styleUrls: ['./level-pass.page.scss'],
})
export class LevelPassPage implements OnInit {
  @Input() level;
  @Input() type;
  @Input() score;
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.type);
  }

  gotoHome() {
    this.router.navigate(['/category', this.type]);
    this.modalController.dismiss();
  }

  retry() {
    this.router.navigate(['/main/' + this.type + '/' + this.level]);
    this.modalController.dismiss('retry');
  }
}
