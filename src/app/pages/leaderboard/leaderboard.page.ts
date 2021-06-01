import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  leaderboardList: any;
  name: any;
  constructor(
    private userService: UserService,
    private db: AngularFireDatabase,
    private router: Router,
    private storage: Storage,
    private statusBar: StatusBar
  ) {
    this.statusBar.backgroundColorByHexString('#e5f9f8');
  }

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/home']);
  }

  ionViewWillEnter() {
    this.getLeaderboard();
    this.getName();
  }

  getName() {
    this.storage.get('name').then((val) => {
      this.name = val;
      console.log(this.name);
    });
  }

  getLeaderboard() {
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
          this.leaderboardList = data;
          this.leaderboardList.forEach((element) => {
            this.db
              .object('/users/' + element.key)
              .valueChanges()
              .subscribe((data: any) => {
                element.name = data.name;
                if (data.name === this.name) {
                  element.highlight = true;
                } else {
                  element.highlight = false;
                }
              });
            console.log(this.leaderboardList);
          });
        },
        (err) => {
          console.log('err', err);
        }
      );
  }
}
