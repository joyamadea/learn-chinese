import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { map } from 'rxjs/operators';
import { PinyinService } from 'src/app/services/pinyin.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.page.html',
  styleUrls: ['./learn.page.scss'],
})
export class LearnPage implements OnInit {
  cat: any;
  lvl: any;
  
  constructor(
    private speechRecognition: SpeechRecognition,
    private pinyinService: PinyinService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.cat = this.activatedRoute.snapshot.params['category'];
    this.lvl = this.activatedRoute.snapshot.params['id'];  
    console.log(this.cat);
  }

  ngOnInit() {
    this.pinyinService.getQuiz(this.cat, this.lvl).snapshotChanges().pipe(
      map(changes => 
       changes.map(c => ({ key: c.payload.key, ...c.payload.val()}))
       )
    ).subscribe(data => {
      // this.categories = data;
      console.log(data);
    })
  }

  startSpeech() {
    let options = {
      language: 'cmn-Hans-CN',
      showPopup: false,
    };
    this.speechRecognition.startListening(options).subscribe(
      (matches: string[]) => console.log(matches),
      (onerror) => console.log('error:', onerror)
    );
  }
}
