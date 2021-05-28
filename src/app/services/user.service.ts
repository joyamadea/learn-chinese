import { DeclarationListEmitMode } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Storage } from '@ionic/storage';
import { count, map } from 'rxjs/operators';
import { Category } from '../models/category';
import { Score } from '../models/score';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private categoryPath = '/category';
  categoryRef: AngularFireList<Category> = null;
  userRef: AngularFireList<User> = null;
  scoreRef: AngularFireList<Score> = null;

  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private storage: Storage
  ) {
    this.categoryRef = db.list(this.categoryPath);
  }

  signInAnonymously() {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInAnonymously().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  signUpWithName(name) {
    let res = name.split(' ');
    let newName = '';
    for (let i = 0; i < res.length; i++) {
      newName = newName + res[i].toLowerCase();
    }
    newName = newName + '@learnchinese.com';
    return new Promise<any>((resolve, reject) => {
      this.fireAuth
        .createUserWithEmailAndPassword(newName, 'leArnChinese')
        .then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  signInWithName(name) {
    let res = name.split(' ');
    let newName = '';
    for (let i = 0; i < res.length; i++) {
      newName = newName + res[i].toLowerCase();
    }
    newName = newName + '@learnchinese.com';
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(newName, 'leArnChinese').then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  logout() {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signOut().then(
        (res) => {
          this.storage.set('uid', null);
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getUid() {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.onAuthStateChanged(
        (user) => {
          if (user) {
            resolve(user.uid);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getScore(cat): AngularFireList<Score> {
    this.scoreRef = this.db.list('/score/' + cat);
    return this.scoreRef;
  }

  addScore(id, scoreAchieved, cat) {
    let body;

    this.getScore(cat)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data: any) => {
        let notFound = true;
        data.forEach((element) => {
          if (element.key == id && scoreAchieved > element.score) {
            console.log('masuk');
            const ref = this.db.list('/score/' + cat);
            body = {
              score: scoreAchieved,
            };
            notFound = false;
            return ref.update(id, body);
          }
        });
        if (notFound) {
          const ref = this.db.list('/score/' + cat);
          body = {
            score: scoreAchieved,
          };
          return ref.set(id, body);
        }
        console.log(data);
      });
    // this.db
    //   .object('/score/' + cat)
    //   .valueChanges()
    //   .subscribe((data: any) => {
    //     // if(data.detail.category == cat && data.detail.score < score) {
    //     //   body = {

    //     //   }
    //     // }
    //     if(data.)
    //     console.log(data);
    //   });
  }

  addTotalScore(id, scoreAchieved) {
    let body;
    let counter = 1;
    let scoring;
    this.db
      .object('/totalscores/' + id)
      .valueChanges()
      .subscribe((data: any) => {
        // const highscoreRef = this.db.list('/totalscores');
        scoring = data.highscore;
        // const newScore = scoreAchieved + data.highscore;
        // body = {
        //   highscore: newScore,
        // };
        // if (counter == 1) {
        //   counter++;
        //   return highscoreRef.set(id, body);
        // }
        // return highscoreRef.set(id, body);
        console.log(data);
      });
    const other = this.db.database.ref('/totalscores');
    other.once('value', (snapshot) => {
      const highscoreRef = this.db.list('/totalscores');
      const newScore = scoreAchieved + scoring;
      if (!snapshot.hasChild(id)) {
        body = {
          highscore: newScore,
        };
        return highscoreRef.set(id, body);
      } else {
        body = {
          highscore: newScore,
        };
        return highscoreRef.update(id, body);
      }
    });
  }

  createUser(id, userName) {
    console.log(id);
    let body;
    const userRef = this.db.list('/users/');
    const other = this.db.database.ref('/users');
    other.once('value', (snapshot) => {
      if (!snapshot.hasChild(id)) {
        body = {
          learn: 'null',
          practice: 'null',
          test: 'null',
          name: userName,
        };
        return userRef.set(id, body);
      } else {
        console.log('already exists');
      }
    });
  }

  create(id): any {
    console.log(id);
    let body;
    const userRef = this.db.list('/users/');
    const other = this.db.database.ref('/users');
    other.once('value', (snapshot) => {
      if (!snapshot.hasChild(id)) {
        body = {
          learn: 'null',
          practice: 'null',
          test: 'null',
        };
        return userRef.set(id, body);
      } else {
        console.log('already exists');
      }
    });
  }

  updateLvl(lvl, type) {
    let id;
    console.log(lvl);
    this.getUid().then((uid) => {
      id = uid;
      const userRef = this.db.list('/users/');
      this.db
        .object('/users/' + id)
        .valueChanges()
        .subscribe((data: any) => {
          let currLvl;
          let body;
          if (type == 'learn') {
            currLvl = data.learn;
            const result = data.learn.split(';');
            if (result[0] == 'null') {
              const newLvl = lvl.toString();
              body = {
                learn: newLvl,
              };
            } else {
              if (!result.includes(lvl.toString())) {
                const newLvl = data.learn + ';' + lvl.toString();
                body = {
                  learn: newLvl,
                };
              }
            }
          } else if (type == 'practice') {
            currLvl = data.practice;
            const result = data.practice.split(';');
            if (result[0] == 'null') {
              const newLvl = lvl.toString();
              body = {
                practice: newLvl,
              };
            } else {
              if (!result.includes(lvl.toString())) {
                const newLvl = data.practice + ';' + lvl.toString();
                body = {
                  practice: newLvl,
                };
              }
            }
          } else if (type == 'test') {
            currLvl = data.test;
            const result = data.test.split(';');
            if (result[0] == 'null') {
              const newLvl = lvl.toString();
              body = {
                test: newLvl,
              };
            } else {
              if (!result.includes(lvl.toString())) {
                const newLvl = data.test + ';' + lvl.toString();
                body = {
                  test: newLvl,
                };
              }
            }
          }

          return userRef.update(id, body);
        });
    });
  }
}
