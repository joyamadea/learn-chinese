import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: String;
  constructor(
    private statusBar: StatusBar,
    private userService: UserService,
    private router: Router,
    private storage: Storage
  ) {
    this.statusBar.backgroundColorByHexString('#b4e4fa');
  }

  ngOnInit() {}

  login() {
    // this.userService.logout();
    this.userService.signUpWithName(this.user).then(
      (data) => {
        console.log(data);
      },
      (err) => {
        if (err.code == 'auth/email-already-in-use') {
          this.userService.signInWithName(this.user).then(
            (data) => {
              this.router.navigate(['/home']);
              console.log(data);
            },
            (err) => {
              console.log(err);
            }
          );
        }
      }
    );

    this.userService.getUid().then((data: any) => {
      this.userService.createUser(data, this.user);
      this.router.navigate(['/home']);
      this.storage.set('uid', data);
    });
  }
}
