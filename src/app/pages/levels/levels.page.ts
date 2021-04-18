import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PinyinService } from 'src/app/services/pinyin.service';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.page.html',
  styleUrls: ['./levels.page.scss'],
})
export class LevelsPage implements OnInit {
  cat: any;
  levels: any;

  constructor(private pinyinService: PinyinService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { 
      this.cat = this.activatedRoute.snapshot.params['id'];
      console.log(this.cat);
    }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.pinyinService.getLevel(this.cat).snapshotChanges().pipe(
      map(changes => 
       changes.map(c => ({ key: c.payload.key }))
       )
    ).subscribe((data: any) => {
      this.levels = data;
      console.log(this.levels);
    })
  }

  goBack() {
    this.router.navigate(['/category']);
  }

  gotoQuiz(level) {
    this.router.navigate(['/learn', this.cat, level]);
  }
}
