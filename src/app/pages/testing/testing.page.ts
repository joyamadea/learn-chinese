import { Component, OnInit } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { PinyinService } from 'src/app/services/pinyin.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.page.html',
  styleUrls: ['./testing.page.scss'],
})
export class TestingPage implements OnInit {
  constructor(
    private speechRecognition: SpeechRecognition,
    private pinyinService: PinyinService
  ) {}

  ngOnInit() {
    this.pinyinService.getPinyin().then((res: any) => {
      console.log(res);
    });
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
