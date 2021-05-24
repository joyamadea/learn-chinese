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
  constructor(private modalController: ModalController, private router: Router,
    ) { 
      
    }

  ngOnInit() {
    console.log(this.level);
  }

  
  gotoHome() {
    this.router.navigate(['/category']);
    this.modalController.dismiss();
  }

  retry() {
    this.router.navigate(['/learn/'+this.level]);
    this.modalController.dismiss();
    this.ngOnInit();
  }

}
