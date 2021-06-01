import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  name: any;
  uid: any;
  progress: any;
  highscore: any;

  constructor(
    private storage: Storage,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  ngOnInit() {
    this.getInfo();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  getInfo() {
    this.storage.get('name').then((val) => {
      this.name = val;
    });

    this.storage.get('uid').then((val) => {
      this.uid = val;
      this.getProgress();
      this.getTotalscore();
    });
  }

  getProgress() {
    this.db
      .object('/progress/' + this.uid)
      .valueChanges()
      .subscribe((data: any) => {
        console.log(data);
        this.progress = data;
      });
  }

  getTotalscore() {
    this.db
      .object('/totalscores/' + this.uid)
      .valueChanges()
      .subscribe((data: any) => {
        this.highscore = data.highscore;
      });
  }
}
