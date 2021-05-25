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
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.level);
  }

  gotoHome() {
    if (this.type == 'practice') {
      this.router.navigate(['/category/practice']);
    } else if (this.type == 'test') {
      this.router.navigate(['/category/test']);
    }
    this.modalController.dismiss();
  }

  retry() {
    this.router.navigate(['/test/' + this.level]);
    this.modalController.dismiss();
    this.ngOnInit();
  }
}
