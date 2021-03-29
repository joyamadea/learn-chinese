import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, timeout, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PinyinService {
  constructor(private http: HttpClient) {}

  getPinyin() {
    return new Promise((resolve, reject) => {
      this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
