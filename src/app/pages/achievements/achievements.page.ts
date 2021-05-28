import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
})
export class AchievementsPage implements OnInit {
  uid: any;
  achievements: any;

  constructor(
    private userService: UserService,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.checkAchievements();
  }

  checkAchievements() {
    // this.userService.getUid().then((data) => {
    //   this.userService
    //     .getUserAchievements(data)
    //     .snapshotChanges()
    //     .pipe(
    //       map((changes) =>
    //         changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
    //       )
    //     )
    //     .subscribe(
    //       (data: any) => {
    //         this.achievements = data;
    //         console.log('achievmenets', data);
    //         this.achievements.forEach((element) => {
    //           this.db
    //             .object('/badges/' + element.key)
    //             .valueChanges()
    //             .subscribe((details: any) => {
    //               element.details = details;
    //             });
    //         });
    //       },
    //       (err) => {
    //         console.log('err', err);
    //       }
    //     );
    // });
    // this.userService.getUid().then((data) => {
    //   this.uid = data;
    //   this.db
    //     .object('/users/' + this.uid)
    //     .valueChanges()
    //     .subscribe((data: any) => {
    //       console.log('data', data);
    //       this.achievements = data.achievements;
    //       // this.achievements.forEach(element => {
    //       //   element.detail = this.db.object('/badges/' + element.key).valueChanges().subscribe((details: any) => {
    //       //   })
    //       // });
    //       console.log('achievements', data.achievements.key);
    //     });
    // });
  }
}
