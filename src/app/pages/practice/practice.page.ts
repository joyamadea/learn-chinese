import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { ConfirmExitPage } from 'src/app/modals/confirm-exit/confirm-exit.page';
import { LevelPassPage } from 'src/app/modals/level-pass/level-pass.page';
import { PinyinService } from 'src/app/services/pinyin.service';
import { UserService } from 'src/app/services/user.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.page.html',
  styleUrls: ['./practice.page.scss'],
})
export class PracticePage implements OnInit {
  cat: any;
  lvl: any;
  quiz: any;
  i: number;
  array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  newArray = [];
  initialCount = 2;
  counter = 0;
  temp = [];
  disableButton = false;
  answer: any;
  url: any;

  constructor(
    private speechRecognition: SpeechRecognition,
    private pinyinService: PinyinService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private zone: NgZone,
    private modalController: ModalController,
    private toastController: ToastController,
    private tts: TextToSpeech
  ) {
    this.cat = this.activatedRoute.snapshot.params['category'];
    this.cat = Number(this.cat);
  }

  ngOnInit() {
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
        // PUSHING TO ARRAY FOR RANDOMIZING INDEX
        for (let index = 0; index < this.quiz.length - 2; index++) {
          // newArray contains indexes of questions
          this.newArray.push(this.initialCount);
          this.initialCount++;
        }
        console.log(data);
        this.random();
      });
  }

  async closeLearning() {
    const modal = await this.modalController.create({
      component: ConfirmExitPage,
      cssClass: 'alert-modal-css',
      backdropDismiss: false,
      componentProps: {
        type: 'practice',
      },
    });
    await modal.present();
  }

  random() {
    // RANDOMIZING ARRAY CONTENTS
    let i = this.newArray.length;
    while (i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tempIndex = this.newArray[i];
      this.newArray[i] = this.newArray[j];
      this.newArray[j] = tempIndex;
    }
    this.i = this.newArray[this.counter];
  }

  next() {
    if (this.counter < this.newArray.length - 1) {
      this.counter++;
      this.i = this.newArray[this.counter];
    } else {
      if (this.temp.length != 0) {
        // REROLLING DECK
        this.counter = 0;
        this.newArray = this.temp;
        this.temp = [];
        this.random();
      } else {
        // FINISH QUIZ
        this.disableButton = true;
        this.userService.updateLvl(this.cat + 1);
        // ADD MODAL HERE
        this.modalFinished();
      }
    }
  }

  texttospeech(word) {
    console.log('word', word);
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
    // SPEECH RECOGNITION OPTIONS
    let options = {
      language: 'cmn-Hans-CN',
      showPopup: false,
    };

    let rightAnswer = false;
    let listened = false;

    // SPEECH RECOGNITION START LISTENING
    this.speechRecognition.startListening(options).subscribe(
      (matches: string[]) => {
        console.log(matches);
        // FIRST MATCH = ANSWER
        this.answer = matches[0];
        // IS ANSWER ACCORDING TO DB
        if (this.answer == this.quiz[this.i].answer) {
          rightAnswer = true;
        }
        // ZONING
        this.zone.run(() => {
          if (rightAnswer) {
            this.rightToast();
            this.next();
            listened = false;
          } else if (!rightAnswer) {
            this.wrongToast();
            listened = false;
          }
        });
      },
      (err) => {
        console.log('error speech', err);
        listened = false;
      }
    );
  }

  async modalFinished() {
    const modal = await this.modalController.create({
      component: LevelPassPage,
      cssClass: 'alert-modal-css',
      backdropDismiss: false,
      componentProps: {
        level: this.cat,
      },
    });
    await modal.present();
  }

  async rightToast() {
    const toast = await this.toastController.create({
      message: 'Correct',
      duration: 2000,
    });
    toast.present();
  }

  async wrongToast() {
    const toast = await this.toastController.create({
      message: 'Wrong',
      duration: 2000,
    });
    toast.present();
  }
}
