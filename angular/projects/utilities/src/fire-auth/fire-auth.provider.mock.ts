import {Observable} from 'rxjs';
import firebase from 'firebase';
import User = firebase.User;
import UserCredential = firebase.auth.UserCredential;

import {FireAuthProvider} from './fire-auth.provider';

export class FireAuthProviderMock {

  public static instance(): Partial<FireAuthProvider> {
    return {
      doSignIn(email: string, password: string): Observable<UserCredential> {
        return null as any;
      },
      getEmail(): Observable<string> {
        return null as any;
      },
      getUser(): Observable<User> {
        return null as any;
      },
      isAuthenticated(): Observable<boolean> {
        return null as any;
      }
    };
  }

}
