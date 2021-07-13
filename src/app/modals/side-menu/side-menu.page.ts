import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  logout() {
    this.userService.logout().then(() => {
      this.router.navigate(['/login']);
      this.dismiss();
    });
  }

  gotoLeaderboard() {
    this.router.navigate(['/leaderboard']);
    this.dismiss();
  }

  gotoProfile() {
    this.router.navigate(['/profile']);
    this.dismiss();
  }
}
