import { DeclarationListEmitMode } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Storage } from '@ionic/storage';
import { count, map } from 'rxjs/operators';
import { Category } from '../models/category';
import { Leaderboard } from '../models/leaderboard';
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
  leaderboardRef: AngularFireList<Leaderboard> = null;

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
        console.log('data', data);
        data.forEach((element) => {
          if (element.key == id && scoreAchieved > element.score) {
            console.log('masuk key == id');
            const ref = this.db.list('/score/' + cat);
            body = {
              score: scoreAchieved,
            };
            notFound = false;
            return ref.update(id, body);
          }
        });
        if (notFound) {
          console.log('masuk not found');
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

    const other = this.db.database.ref('/totalscores');
    other.once('value', (snapshot) => {
      console.log('masuk add total score');
      const highscoreRef = this.db.list('/totalscores');
      let newScore;
      // const newScore = scoreAchieved + scoring;
      if (!snapshot.hasChild(id)) {
        newScore = scoreAchieved;
        console.log('masuk blm ada id');
        body = {
          highscore: newScore,
        };
        console.log('body', body);
        if (counter == 1) {
          counter++;
          return highscoreRef.set(id, body);
        }
      } else {
        this.db
          .object('/totalscores/' + id)
          .valueChanges()
          .subscribe((data: any) => {
            scoring = data.highscore;
            newScore = scoreAchieved + scoring;
            body = {
              highscore: newScore,
            };
            if (counter == 1) {
              counter++;
              return highscoreRef.set(id, body);
            }
            console.log('totalscores', newScore);
          });

        // return highscoreRef.update(id, body);
      }
    });
  }

  createUser(id, userName) {
    console.log(id);
    let body;
    let body2;
    const userRef = this.db.list('/users/');
    const progressRef = this.db.list('/progress/');
    const other = this.db.database.ref('/users');
    other.once('value', (snapshot) => {
      if (!snapshot.hasChild(id)) {
        body = {
          learn: 'null',
          practice: 'null',
          test: 'null',
          name: userName,
        };

        const todayDate = new Date(Date.now()).toLocaleDateString();
        console.log(todayDate);
        body2 = {
          lastplayed: todayDate,
          lastscore: 0,
        };
        return userRef.set(id, body), progressRef.set(id, body2);
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

  getLeaderboard(): AngularFireList<Leaderboard> {
    this.leaderboardRef = this.db.list('/totalscores/');
    return this.leaderboardRef;
  }

  setProgress(id, score) {
    let counter = 1;
    let body;
    const progressRef = this.db.list('/progress/');
    this.db
      .object('progress/' + id)
      .valueChanges()
      .subscribe((data: any) => {
        if (counter == 1) {
          counter++;
          const todaydate = new Date(Date.now()).toLocaleDateString();
          if (todaydate == data.lastplayed) {
            let newScore = data.lastscore + score;
            body = {
              lastscore: newScore,
            };
            return progressRef.update(id, body);
          } else {
            let newScore = score;
            body = {
              lastplayed: todaydate,
              lastscore: newScore,
            };
            return progressRef.update(id, body);
          }
        }
      });
  }
}
