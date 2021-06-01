import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
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

  constructor(private storage: Storage, private db: AngularFireDatabase) {}

  ngOnInit() {
    this.getInfo();
  }

  getInfo() {
    this.storage.get('name').then((val) => {
      this.name = val;
    });

    this.storage.get('uid').then((val) => {
      this.uid = val;
      this.getProgress();
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
}
