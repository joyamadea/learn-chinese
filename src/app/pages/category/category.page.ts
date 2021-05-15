import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
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

  constructor(private pinyinService: PinyinService,
    private router: Router, private userService: UserService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkUid();
    this.pinyinService.getCategory().snapshotChanges().pipe(
      map(changes => 
       changes.map(c => ({ key: c.payload.key, ...c.payload.val()}))
       )
    ).subscribe(data => {
      this.categories = data;
      console.log(data);
    })
    // this.getCats();
  }

  checkUid() {
    console.log("masuk check uid");
    this.userService.getUid().then((data) => {
      this.uid = data;
      this.db.object('/users/' + this.uid).valueChanges().subscribe((data: any) => {
        this.currLvl = data.level;
        this.categories.forEach(element => {
          if(element.key <= this.currLvl) {
            element.available = true;
          } else {
            element.available = false;
          }
        });
        console.log("updated", this.categories);
      }, (err) => {
        console.log(err);
      })
    })
    
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  gotoLevels(cat){
    this.router.navigate(['/learn',cat]);
  }

}
