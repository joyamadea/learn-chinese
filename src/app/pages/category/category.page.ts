import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PinyinService } from 'src/app/services/pinyin.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories: any;

  constructor(private pinyinService: PinyinService,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.pinyinService.getCategory().snapshotChanges().pipe(
      map(changes => 
       changes.map(c => ({ key: c.payload.key, ...c.payload.val()}))
       )
    ).subscribe(data => {
      this.categories = data;
      console.log(data);
    })
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  gotoLevels(cat){
    this.router.navigate(['/category',cat]);
  }

}
