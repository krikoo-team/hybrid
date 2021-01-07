import {fakeAsync, TestBed} from '@angular/core/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {NextObserver, of, throwError} from 'rxjs';
import firebase from 'firebase';
import User = firebase.User;
import UserCredential = firebase.auth.UserCredential;

import {FireAuthProvider} from './fire-auth.provider';

describe('Fire Auth Provider', () => {

  describe('doSignIn', () => {

    class AngularFireAuthMock {
      public static instance(): Partial<AngularFireAuth> {
        return {
          signInWithEmailAndPassword: null as any
        };
      }
    }

    let fireAuthProvider: FireAuthProvider;
    let signInWithEmailAndPasswordSpy: jasmine.Spy;

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          FireAuthProvider,
          {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
        ]
      });

      fireAuthProvider = TestBed.inject(FireAuthProvider);

      const angularFireAuth: AngularFireAuth = TestBed.inject(AngularFireAuth);
      signInWithEmailAndPasswordSpy = spyOn(angularFireAuth, 'signInWithEmailAndPassword');
    });


    it('should sign in with email and password.', fakeAsync(() => {
      const expectedUserCredential: UserCredential = {
        additionalUserInfo: null,
        credential: null,
        operationType: null,
        user: null
      };
      signInWithEmailAndPasswordSpy.and.returnValue(Promise.resolve(expectedUserCredential))
      const doSignInNextObserver: NextObserver<UserCredential> = {
        complete: () => {
          expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledTimes(1)
          expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith('email', 'password')
        },
        error: () => fail(),
        next: (userCredential: UserCredential) => expect(userCredential).toEqual(expectedUserCredential)
      }
      fireAuthProvider.doSignIn('email', 'password').subscribe(doSignInNextObserver);
    }));

    it('should retrieve an error.', fakeAsync(() => {
      signInWithEmailAndPasswordSpy.and.returnValue(Promise.reject('error'))
      const doSignInNextObserver: NextObserver<UserCredential> = {
        complete: () => fail(),
        error: (error: string) => {
          expect(error).toEqual('error');
          expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledTimes(1)
          expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith('email', 'password')
        },
        next: () => fail()
      }
      fireAuthProvider.doSignIn('email', 'password').subscribe(doSignInNextObserver);
    }));

  });

  describe('#getEmail', () => {

    it('should just get the user email.', () => {
      class AngularFireAuthMock {
        public static instance(): Partial<AngularFireAuth> {
          return {user: of({email: 'email'} as Partial<User> as any)};
        }
      }

      TestBed.configureTestingModule({
        providers: [
          FireAuthProvider,
          {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
        ],
        imports: []
      });

      const fireAuthProvider: FireAuthProvider = TestBed.inject(FireAuthProvider);

      const getEmailNextObserver: NextObserver<string | null> = {
        complete: () => expect().nothing(),
        error: () => fail(),
        next: (email: string | null) => expect(email).toEqual('email')
      }
      fireAuthProvider.getEmail().subscribe(getEmailNextObserver);
    });

    it('should get a null value.', () => {
      class AngularFireAuthMock {
        public static instance(): Partial<AngularFireAuth> {
          return {user: of(null)};
        }
      }

      TestBed.configureTestingModule({
        providers: [
          FireAuthProvider,
          {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
        ],
        imports: []
      });

      const fireAuthProvider: FireAuthProvider = TestBed.inject(FireAuthProvider);

      const getEmailNextObserver: NextObserver<string | null> = {
        complete: () => expect().nothing(),
        error: () => fail(),
        next: (email: string | null) => expect(email).toBeNull()
      }
      fireAuthProvider.getEmail().subscribe(getEmailNextObserver);
    });

    it('should return a "getting email" error message.', () => {
      class AngularFireAuthMock {
        public static instance(): Partial<AngularFireAuth> {
          return {user: throwError(null)};
        }
      }

      TestBed.configureTestingModule({
        providers: [
          FireAuthProvider,
          {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
        ]
      });

      const fireAuthProvider: FireAuthProvider = TestBed.inject(FireAuthProvider);

      const getEmailNextObserver: NextObserver<string | null> = {
        complete: () => expect().nothing(),
        error: () => fail(),
        next: (email: string | null) => expect(email).toEqual('Error getting email.')
      }
      fireAuthProvider.getEmail().subscribe(getEmailNextObserver);
    });

  });

  it('#getUser should get an user.', () => {
    class AngularFireAuthMock {
      public static instance(): Partial<AngularFireAuth> {
        return {
          user: of({}) as any
        };
      }
    }

    TestBed.configureTestingModule({
      providers: [
        FireAuthProvider,
        {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
      ]
    });

    const fireAuthProvider: FireAuthProvider = TestBed.inject(FireAuthProvider);

    const getUserNextObserver: NextObserver<User | null> = {
      complete: () => expect().nothing(),
      error: () => fail(),
      next: (user: User | null) => expect(user).toEqual({} as any)
    }
    fireAuthProvider.getUser().subscribe(getUserNextObserver);
  });

  describe('#getUserId', () => {

    it('should just get the user id.', () => {
      class AngularFireAuthMock {
        public static instance(): Partial<AngularFireAuth> {
          return {user: of({uid: 'id'} as Partial<User> as any)};
        }
      }

      TestBed.configureTestingModule({
        providers: [
          FireAuthProvider,
          {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
        ],
        imports: []
      });

      const fireAuthProvider: FireAuthProvider = TestBed.inject(FireAuthProvider);

      const getUserIdNextObserver: NextObserver<string | null> = {
        complete: () => expect().nothing(),
        error: () => fail(),
        next: (id: string | null) => expect(id).toEqual('id')
      }
      fireAuthProvider.getUserId().subscribe(getUserIdNextObserver);
    });

    it('should get a null value.', () => {
      class AngularFireAuthMock {
        public static instance(): Partial<AngularFireAuth> {
          return {user: of(null)};
        }
      }

      TestBed.configureTestingModule({
        providers: [
          FireAuthProvider,
          {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
        ],
        imports: []
      });

      const fireAuthProvider: FireAuthProvider = TestBed.inject(FireAuthProvider);

      const getUserIdNextObserver: NextObserver<string | null> = {
        complete: () => expect().nothing(),
        error: () => fail(),
        next: (id: string | null) => expect(id).toBeNull()
      }
      fireAuthProvider.getUserId().subscribe(getUserIdNextObserver);
    });

    it('should return a "getting id" error message.', () => {
      class AngularFireAuthMock {
        public static instance(): Partial<AngularFireAuth> {
          return {user: throwError(null)};
        }
      }

      TestBed.configureTestingModule({
        providers: [
          FireAuthProvider,
          {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
        ]
      });

      const fireAuthProvider: FireAuthProvider = TestBed.inject(FireAuthProvider);

      const getUserIdNextObserver: NextObserver<string | null> = {
        complete: () => expect().nothing(),
        error: () => fail(),
        next: (id: string | null) => expect(id).toEqual('Error getting id.')
      }
      fireAuthProvider.getUserId().subscribe(getUserIdNextObserver);
    });

  });

  describe('#isAuthenticated', () => {

    it('should return a positive result when there are a user authenticated.', () => {
      class AngularFireAuthMock {
        public static instance(): Partial<AngularFireAuth> {
          return {
            user: of({}) as any
          };
        }
      }

      TestBed.configureTestingModule({
        providers: [
          FireAuthProvider,
          {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
        ],
        imports: []
      });

      const fireAuthProvider: FireAuthProvider = TestBed.inject(FireAuthProvider);

      const isAuthenticatedNextObserver: NextObserver<boolean> = {
        complete: () => expect().nothing(),
        error: () => fail(),
        next: (is: boolean) => expect(is).toEqual(true)
      }
      fireAuthProvider.isAuthenticated().subscribe(isAuthenticatedNextObserver);
    });

    it('should return a negative result when there are not a user authenticated.', () => {
      class AngularFireAuthMock {
        public static instance(): Partial<AngularFireAuth> {
          return {
            user: of(null)
          };
        }
      }

      TestBed.configureTestingModule({
        providers: [
          FireAuthProvider,
          {provide: AngularFireAuth, useValue: AngularFireAuthMock.instance()}
        ]
      });

      const fireAuthProvider: FireAuthProvider = TestBed.inject(FireAuthProvider);

      const isAuthenticatedNextObserver: NextObserver<boolean> = {
        complete: () => expect().nothing(),
        error: () => fail(),
        next: (is: boolean) => expect(is).toEqual(false)
      }
      fireAuthProvider.isAuthenticated().subscribe(isAuthenticatedNextObserver);
    });

  });

});
