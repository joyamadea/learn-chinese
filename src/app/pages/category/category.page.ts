import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { ConfirmExitPage } from 'src/app/modals/confirm-exit/confirm-exit.page';
import { LevelPassPage } from 'src/app/modals/level-pass/level-pass.page';
import { PinyinService } from 'src/app/services/pinyin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories: any;
  uid: any;
  currLvl = 1;
  url: any;
  type: any;
  scoreArray = Array(3);
  loaded = false;

  constructor(
    private pinyinService: PinyinService,
    private router: Router,
    private userService: UserService,
    private db: AngularFireDatabase,
    private modalController: ModalController,
    private storage: AngularFireStorage,
    private activatedRoute: ActivatedRoute,
    private statusBar: StatusBar
  ) {
    this.statusBar.backgroundColorByHexString('#2e495e');
    this.type = this.activatedRoute.snapshot.params['type'];
    console.log('type', this.type);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.pinyinService
      .getCategory()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(
        (data) => {
          this.categories = data;
          this.categories.forEach((element) => {
            let img = this.storage.ref(element.pic);
            img.getDownloadURL().subscribe((Url) => {
              element.url = Url;
            });
            if (element.key == this.categories.length) {
              this.loaded = true;
              console.log(this.loaded);
            }
          });

          this.checkUid();
          console.log(this.categories);
        },
        (err) => {
          console.log('err', err);
        }
      );
  }

  ionViewWillLeave() {
    this.loaded = false;
  }
  checkUid() {
    console.log('masuk check uid');
    this.userService.getUid().then((data) => {
      this.uid = data;
      this.db
        .object('/users/' + this.uid)
        .valueChanges()
        .subscribe(
          (data: any) => {
            let result;
            if (this.type == 'learn') {
              result = data.learn.split(';');
            } else if (this.type == 'practice') {
              result = data.practice.split(';');
            } else if (this.type == 'test') {
              result = data.test.split(';');
            }
            this.categories.forEach((element) => {
              if (result.includes(element.key.toString())) {
                element.available = true;
              } else {
                element.available = false;
              }
            });
            console.log('updated', this.categories);
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  gotoLevels(cat) {
    this.router.navigate(['/main', this.type, cat]);
    // if (this.type == 'test') {
    //   this.router.navigate(['/test', this.type, cat]);
    // } else if (this.type == 'practice') {
    //   this.router.navigate(['/practice', cat]);
    // } else if (this.type == 'learn') {
    //   this.router.navigate(['/learn', cat]);
    // }
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: LevelPassPage,
      cssClass: 'alert-modal-css',
      backdropDismiss: false,
    });
    await modal.present();
  }
}
