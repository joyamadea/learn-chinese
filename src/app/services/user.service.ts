import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fireAuth: AngularFireAuth, private db: AngularFireDatabase) { }

  signInAnonymously() {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInAnonymously().then((res) => {
        resolve(res);
      },
      (err) => {
        reject(err);
      });
    });
  }

  getUid() {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.onAuthStateChanged((user) => {
        if(user) {
          resolve(user.uid);
        }
      }, (err) => {
        reject(err);
      })
    })
  }

  create(id): any{
    console.log(id);
    let body;
    const userRef = this.db.list("/users/");
    const other = this.db.database.ref("/users");
    other.once('value', (snapshot) => {
      if(!snapshot.hasChild(id)){
        body = {
          level: 1
        };
        return userRef.set(id, body);
      } else {
        console.log("already exists");
      }
    })
  }

  updateLvl(lvl) {
    let id;
    this.getUid().then((uid) => {
      id = uid;
      const userRef = this.db.list("/users/");
      let body = {
        level: lvl
      }
      return userRef.set(id, body);
    })
  }
}
