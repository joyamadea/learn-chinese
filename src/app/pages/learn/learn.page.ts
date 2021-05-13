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
  array = [1,2,3,4,5,6,7,8,9,10];
  newArray = [];
  initialCount = 1;
  counter = 0;
  temp = [];
  disableButton = false;
  answer: any;

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
    this.speechRecognition.hasPermission().then((perms: boolean) => {
      if(perms == false){
        this.speechRecognition.requestPermission().then(() => {
          console.log("granted");
        }, (err) => {
          console.log("denied")
        });
      }
    })
    this.pinyinService.getQuiz(this.cat).snapshotChanges().pipe(
      map(changes => 
       changes.map(c => ({ key: c.payload.key, ...c.payload.val()}))
       )
    ).subscribe(data => {
      this.quiz = data;
      for (let index = 0; index < this.quiz.length-1; index++) {
        this.newArray.push(this.initialCount);
        this.initialCount++;
        console.log(this.newArray);
      }
      console.log(data);
      this.random();
    });
    
  }

  random() {
    let i = this.newArray.length;
    while(i--){
      let j = Math.floor(Math.random() * (i+1));
      let tempIndex = this.newArray[i];
      this.newArray[i] = this.newArray[j];
      this.newArray[j] = tempIndex;
    }
    console.log(this.newArray);
    this.i = this.newArray[this.counter];
    console.log("initial i", this.i);
  }

  salah(i){
    this.temp.push(i);
    console.log("temp array", this.temp);
    this.next();
  }

  next() {
    if(this.counter < this.newArray.length-1){
      this.counter++;
      this.i = this.newArray[this.counter];
      console.log("new", this.i);
    } else {
      if(this.temp.length != 0){
        this.counter = 0;
        this.newArray = this.temp;
        this.temp = [];
        this.random();
      } else {
        this.disableButton = true;
      }
    }
  }

  startSpeech() {
    let options = {
      language: 'cmn-Hans-CN',
      showPopup: false,
    };
    let rightAnswer = false;
    let listened = false;
    this.speechRecognition.startListening(options).subscribe((matches: string[]) => {
      console.log(matches);
      this.answer = matches[0];
      if(this.answer == this.quiz[this.i].answer){
        console.log("right");
        rightAnswer = true;
        console.log("i after next", this.i);
      } else {
        console.log("wrong")
      }
      listened = true;
    }, (err)=> {
      console.log("error speech", err);
    });
    if(rightAnswer && listened) {
      console.log("masuk right answer");
      this.next();
      listened = false;
    } else {
      this.salah(this.i);
      listened = false;
    }
  }
}
