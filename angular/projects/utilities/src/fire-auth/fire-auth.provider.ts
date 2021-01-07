import {AngularFireAuth} from '@angular/fire/auth';
import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {Observable, of, Subscriber} from 'rxjs';
import {catchError, first, map} from 'rxjs/operators';
import User = firebase.User;
import UserCredential = firebase.auth.UserCredential;

@Injectable()
export class FireAuthProvider {

  private readonly GETTING_ERROR_EMAIL_MESSAGE: string = 'Error getting email.';
  private readonly GETTING_ERROR_ID_MESSAGE: string = 'Error getting id.';

  constructor(private angularFireAuth: AngularFireAuth) {
  }

  public doSignIn(email: string, password: string): Observable<UserCredential> {
    return new Observable((subscriber: Subscriber<UserCredential>) => {
      this.angularFireAuth.signInWithEmailAndPassword(email, password)
        .then((userCredentials: UserCredential) => {
          subscriber.next(userCredentials);
          subscriber.complete();
        })
        .catch((error: any) => subscriber.error(error));
    });
  }

  public getEmail(): Observable<string | null> {
    return this.getUser().pipe(
      first(),
      map((user: User | null) => !user ? null : user.email),
      catchError(() => of(this.GETTING_ERROR_EMAIL_MESSAGE))
    );
  }

  public getUser(): Observable<User | null> {
    return this.angularFireAuth.user;
  }

  public getUserId(): Observable<string | null> {
    return this.getUser().pipe(
      first(),
      map((user: User | null) => !user ? null : user.uid),
      catchError(() => of(this.GETTING_ERROR_ID_MESSAGE))
    );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.getUser().pipe(first(), map((user: User | null) => !!user));
  }

}
