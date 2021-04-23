import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, timeout, retry } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Quiz } from '../models/quiz';
import { Category } from '../models/category';
import { Level } from '../models/levels';

@Injectable({
  providedIn: 'root',
})
export class PinyinService {
  private categoryPath = '/category';
  quizRef: AngularFireList<Quiz> = null;
  categoryRef: AngularFireList<Category> = null;

  constructor(private http: HttpClient, private db: AngularFireDatabase) {
    this.categoryRef = db.list(this.categoryPath);
  }

  getPinyin() {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.pinyin.pepe.asia/pinyin/我的猫喜欢喝牛奶').subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getQuiz(cat): AngularFireList<Quiz> {
    this.quizRef = this.db.list('/category/'+cat);
    return this.quizRef;
  }

  getCategory(): AngularFireList<Category> {
    return this.categoryRef;
  }

}
