import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { count, map } from 'rxjs/operators';
import { ConfirmExitPage } from 'src/app/modals/confirm-exit/confirm-exit.page';
import { LevelPassPage } from 'src/app/modals/level-pass/level-pass.page';
import { PinyinService } from 'src/app/services/pinyin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  cat: any;
  quiz: any;
  i: number;
  indexArray = [];
  initialCount = 2;
  counter = 0;
  temp = [];
  answer: any;
  score = 0;
  scoreArray = Array();
  altAnswer: any;
  type: any;
  uid: any;
  listened = false;
  options = {
    language: 'cmn-Hans-CN',
    showPopup: false,
  };

  constructor(
    private speechRecognition: SpeechRecognition,
    private pinyinService: PinyinService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private zone: NgZone,
    private modalController: ModalController,
    private toastController: ToastController,
    private storage: AngularFireStorage,
    private tts: TextToSpeech,
    private statusBar: StatusBar,
    private nativeStorage: Storage
  ) {
    this.cat = this.activatedRoute.snapshot.params['id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    this.statusBar.backgroundColorByHexString('#2e495e');
    console.log(this.type);
    this.cat = Number(this.cat);
  }

  ngOnInit() {
    this.checkSpeechPermission();
  }

  ionViewWillEnter() {
    // FETCH QUIZ
    this.pinyinService
      .getQuiz(this.cat)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        this.quiz = data;
        this.scoreArray = Array(this.quiz.length - 2);

        this.quiz.forEach((element) => {
          let img = this.storage.ref(element.pic);
          img.getDownloadURL().subscribe((Url) => {
            element.url = Url;
          });
        });

        // PUSHING TO ARRAY FOR RANDOMIZING INDEX
        for (let index = 0; index < this.quiz.length - 2; index++) {
          // indexArray contains indexes of the questions
          this.indexArray.push(this.initialCount);
          this.initialCount++;
        }
        console.log(data);
        this.random();
      });
    this.getId();
  }

  getId() {
    this.nativeStorage.get('uid').then((val) => {
      this.uid = val;
      // this.userService.addScore(val, 30, 1);
      // this.userService.addTotalScore(val, 30);
    });
  }

  checkSpeechPermission() {
    // SPEECH PERMISSIONS
    this.speechRecognition.hasPermission().then((perms: boolean) => {
      if (perms == false) {
        this.speechRecognition.requestPermission().then(
          () => {
            console.log('granted');
          },
          (err) => {
            console.log('denied');
          }
        );
      }
    });
  }

  async closeLearning() {
    const modal = await this.modalController.create({
      component: ConfirmExitPage,
      cssClass: 'alert-modal-css',
      backdropDismiss: false,
      componentProps: {
        type: this.type,
      },
    });
    await modal.present();
  }

  random() {
    // RANDOMIZING ARRAY CONTENTS
    let i = this.indexArray.length;
    while (i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tempIndex = this.indexArray[i];
      this.indexArray[i] = this.indexArray[j];
      this.indexArray[j] = tempIndex;
    }
    this.i = this.indexArray[this.counter];
  }

  wrongAnswer(i) {
    // PUSHING WRONG ANSWER TO TEMPORARY ARRAY
    // this.temp.push(i);
    // console.log('temp array', this.temp);
    if (this.type == 'test') {
      this.next();
    }
  }

  prev() {
    if (this.counter > 0) {
      this.counter--;
      this.i = this.indexArray[this.counter];
    }
  }

  next(result = 'right') {
    if (result == 'right') {
      this.score++;
    }
    if (this.counter < this.indexArray.length - 1) {
      if (!(result == 'wrong' && this.type == 'practice')) {
        this.counter++;
        this.i = this.indexArray[this.counter];
      }
    } else {
      if (this.type == 'test') {
        this.updatingScores();
      }
      // FINISH QUIZ
      this.userService.updateLvl(this.cat, this.type);
      // ADD MODAL HERE
      this.modalFinished();
    }
  }

  updatingScores() {
    let newScore = this.score * 10;
    console.log('score', newScore);
    const trai = this.userService.addScore(this.uid, newScore, this.cat);
    console.log(trai);
    this.userService.addTotalScore(this.uid, newScore);
    this.userService.setProgress(this.uid, newScore);
  }

  async modalFinished() {
    const newScore = this.score * 10;
    const modal = await this.modalController.create({
      component: LevelPassPage,
      cssClass: 'alert-modal-css',
      backdropDismiss: false,
      componentProps: {
        level: this.cat,
        type: this.type,
        score: newScore,
      },
    });

    modal.onDidDismiss().then((res) => {
      if (res) {
        this.counter = 0;
        this.score = 0;
        this.random();
        console.log('masuk');
      }
    });
    return await modal.present();
  }

  async rightToast() {
    const toast = await this.toastController.create({
      message: 'Correct',
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async wrongToast() {
    const toast = await this.toastController.create({
      message: 'Wrong',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  texttospeech(word) {
    this.tts
      .speak({
        text: word,
        locale: 'zh-CN',
        rate: 0.8,
      })
      .then(
        () => {
          console.log('success');
        },
        (err) => {
          console.log('err tts', err);
        }
      );
  }

  startSpeech() {
    let rightAnswer = false;

    // SPEECH RECOGNITION START LISTENING
    if (!this.listened) {
      this.speechRecognition.startListening(this.options).subscribe(
        (matches: string[]) => {
          console.log(matches);
          // FIRST MATCH = ANSWER
          this.answer = matches[0];
          this.altAnswer = matches[1];
          matches.forEach(element => {
            if(element == this.quiz[this.i].answer) {
              rightAnswer = true;
            }
          });
          // IS ANSWER ACCORDING TO DB
          // if (
          //   this.answer == this.quiz[this.i].answer ||
          //   this.altAnswer == this.quiz[this.i].answer
          // ) {
          //   rightAnswer = true;
          // }
          // ZONING
          this.zone.run(() => {
            if (rightAnswer) {
              this.rightToast();
              this.next();
              this.listened = false;
            } else if (!rightAnswer) {
              this.wrongToast();
              this.next('wrong');
              this.listened = false;
            }
          });
        },
        (err) => {
          console.log('error speech', err);
          this.listened = false;
        }
      );
    }
  }
}
