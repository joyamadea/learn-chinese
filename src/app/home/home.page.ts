import { Component } from '@angular/core';
import { PinyinService } from '../services/pinyin.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private pinyinService: PinyinService) {}

  ngOnInit() {
    // this.pinyinService.getPinyin().then((res: any) => {
    //   console.log(res);
    // });
  }
}
