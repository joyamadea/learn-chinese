import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  leaderboardList: any;

  constructor(
    private userService: UserService,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getLeaderboard();
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
          console.log(data);
          this.leaderboardList = data;
          this.leaderboardList.forEach((element) => {
            this.db
              .object('/users/' + element.key)
              .valueChanges()
              .subscribe((data: any) => {
                element.name = data.name;
              });
          });
          console.log('uwe', this.leaderboardList);
        },
        (err) => {
          console.log('err', err);
        }
      );
  }
}
