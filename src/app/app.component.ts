import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  uid: any;

  constructor(
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private storage: Storage,
    private router: Router
  ) {
    this.statusBar.backgroundColorByHexString('#2e495e');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.checkUser();
  }

  checkUser() {
    this.storage.get('uid').then((val) => {
      this.uid = val;
      console.log(this.uid);

      if (this.uid == null) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }
}
