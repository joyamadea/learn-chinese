import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PinyinService } from '../../services/pinyin.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private pinyinService: PinyinService, private router: Router) {}

  ngOnInit() {
    // this.pinyinService.getPinyin().then((res: any) => {
    //   console.log(res);
    // });
   this.pinyinService.getCategory().snapshotChanges().pipe(
     map(changes => 
      changes.map(c => ({ key: c.payload.key, ...c.payload.val()}))
      )
   ).subscribe(data => {
     console.log(data);
   })
  }

  gotoCat() {
    this.router.navigate(['/category']);
  }
}
