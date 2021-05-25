import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private pinyinService: PinyinService,
    private router: Router,
    private userService: UserService,
    private db: AngularFireDatabase,
    private modalController: ModalController,
    private storage: AngularFireStorage,
    private activatedRoute: ActivatedRoute
  ) {
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
          });
          this.checkUid();
          console.log(this.categories);
        },
        (err) => {
          console.log('err', err);
        }
      );
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
            this.currLvl = data.level;
            this.categories.forEach((element) => {
              if (element.key <= this.currLvl) {
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
    if (this.type == 'test') {
      this.router.navigate(['/test', cat]);
    } else if (this.type == 'practice') {
      this.router.navigate(['/practice', cat]);
    }
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ConfirmExitPage,
      cssClass: 'alert-modal-css',
      backdropDismiss: false,
    });
    await modal.present();
  }
}
