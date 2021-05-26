import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Category } from '../models/category';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private categoryPath = '/category';
  categoryRef: AngularFireList<Category> = null;
  userRef: AngularFireList<User> = null;

  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFireDatabase
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

  getUserAchievements(uid): AngularFireList<User> {
    this.userRef = this.db.list('/users/' + uid + '/achievements');
    return this.userRef;
  }

  create(id): any {
    console.log(id);
    let body;
    const userRef = this.db.list('/users/');
    const other = this.db.database.ref('/users');
    other.once('value', (snapshot) => {
      if (!snapshot.hasChild(id)) {
        body = {
          level: 'null',
        };
        return userRef.set(id, body);
      } else {
        console.log('already exists');
      }
    });
  }

  updateLvl(lvl) {
    let id;
    console.log(lvl);
    this.getUid().then((uid) => {
      id = uid;
      const userRef = this.db.list('/users/');
      this.db
        .object('/users/' + id)
        .valueChanges()
        .subscribe((data: any) => {
          const currLvl = data.level;
          const result = data.level.split(';');
          let body;
          if (result[0] == 'null') {
            const newLvl = lvl.toString();
            body = {
              level: newLvl,
            };
          } else {
            if (!result.includes(lvl.toString())) {
              const newLvl = data.level + ';' + lvl.toString();
              body = {
                level: newLvl,
              };
            }
          }
          return userRef.set(id, body);
          // if (currLvl == lvl - 1) {
          //   let body = {
          //     level: lvl,
          //   };
          //   return userRef.set(id, body);
          // }
        });
    });
  }
}
