import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PinyinService } from '../../services/pinyin.service';
import { UserService } from 'src/app/services/user.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController } from '@ionic/angular';
import { SideMenuPage } from 'src/app/modals/side-menu/side-menu.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  testing: any;
  constructor(
    private pinyinService: PinyinService,
    private router: Router,
    private userService: UserService,
    private statusBar: StatusBar,
    private storage: Storage,
    private db: AngularFireDatabase,
    private modalController: ModalController
  ) {
    this.statusBar.backgroundColorByHexString('#e5f9f8');
  }

  ngOnInit() {
    this.storage.get('uid').then((val) => {
      // this.userService.addScore(val, 30, 1);
      // this.userService.addTotalScore(val, 30);
      // this.userService.setProgress(val, 30);
    });
    // this.userService.logout();
    // this.fetchUser();
    // this.leaderboard();
  }

  leaderboard() {
    this.userService
      .getLeaderboard()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(
        (data) => {
          console.log(data);
          this.testing = data;
          this.testing.forEach((element) => {
            this.db
              .object('/users/' + element.key)
              .valueChanges()
              .subscribe((data: any) => {
                element.name = data.name;
              });
          });
          console.log('uwe', this.testing);
        },
        (err) => {
          console.log('err', err);
        }
      );
  }

  fetchUser() {
    this.userService.signInAnonymously().then((data: any) => {
      console.log(data);
    });

    // this.userService.getUid().then((data: any) => {
    //   this.userService.create(data);
    // });
  }

  async openSideMenu() {
    const modal = await this.modalController.create({
      component: SideMenuPage,
      cssClass: 'alert-modal-css',
    });
    await modal.present();
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
