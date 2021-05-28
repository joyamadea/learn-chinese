import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PinyinService } from '../../services/pinyin.service';
import { UserService } from 'src/app/services/user.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private pinyinService: PinyinService,
    private router: Router,
    private userService: UserService,
    private statusBar: StatusBar
  ) {
    this.statusBar.backgroundColorByHexString('#e5f9f8');
  }

  ngOnInit() {
    // this.userService.logout();
    // this.fetchUser();
  }

  fetchUser() {
    this.userService.signInAnonymously().then((data: any) => {
      console.log(data);
    });

    this.userService.getUid().then((data: any) => {
      this.userService.create(data);
    });
  }

  logout() {
    this.userService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  gotoCat(type) {
    if (type == 'test') {
      this.router.navigate(['/category', type]);
    } else if (type == 'practice') {
      this.router.navigate(['/category', type]);
    } else if (type == 'learn') {
      this.router.navigate(['/category', type]);
    }
  }

  gotoAchievements() {
    this.router.navigate(['/achievements']);
  }
}
