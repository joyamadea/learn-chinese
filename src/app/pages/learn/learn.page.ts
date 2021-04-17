import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { count, map } from 'rxjs/operators';
import { PinyinService } from 'src/app/services/pinyin.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.page.html',
  styleUrls: ['./learn.page.scss'],
})
export class LearnPage implements OnInit {
  cat: any;
  lvl: any;
  quiz: any;
  i: number;
  fakeLength = 10;
  array = [1,2,3,4,5,6,7,8,9,10];
  counter = 0;
  temp = [];
  disableButton = false;

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
      this.quiz = data;
      console.log(data);
    });
    this.random();
  }

  random() {
    let i = this.array.length;
    console.log(i);
    while(i--){
      let j = Math.floor(Math.random() * (i+1));
      let tempIndex = this.array[i];
      this.array[i] = this.array[j];
      this.array[j] = tempIndex;
    }
    console.log(this.array);
    this.i = this.array[this.counter];
    console.log("initial i", this.i);
  }

  salah(i){
    this.temp.push(i);
    console.log("temp array", this.temp);
    this.next();
  }

  next() {
    if(this.counter < this.array.length-1){
      this.counter++;
      this.i = this.array[this.counter];
      console.log("new", this.i);
    } else {
      if(this.temp.length != 0){
        console.log("masuk new deck");
        this.counter = 0;
        this.array = this.temp;
        this.temp = [];
        this.random();
      } else {
        console.log("it is finished");
        this.disableButton = true;
      }
    }
    
    
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
