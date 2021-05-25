import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PinyinService } from '../../services/pinyin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private pinyinService: PinyinService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    this.userService.signInAnonymously().then((data: any) => {
      console.log(data);
    });

    this.userService.getUid().then((data: any) => {
      this.userService.create(data);
    });
  }

  gotoCat(type) {
    if (type == 'test') {
      this.router.navigate(['/category', 'test']);
    } else if (type == 'practice') {
      this.router.navigate(['/category', 'practice']);
    }
  }

  gotoAchievements() {
    this.router.navigate(['/achievements']);
  }
}
