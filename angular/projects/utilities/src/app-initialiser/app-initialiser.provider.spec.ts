import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppInitialiserProvider} from './app-initialiser.provider';

class PlatformMock {
  public static instance(): Partial<Platform> {
    return {
      ready(): Promise<string> {
        return Promise.resolve('');
      }
    };
  }
}

class SplashScreenMock {
  public static instance(): Partial<SplashScreen> {
    return {
      hide() {
      }
    };
  }
}

class StatusBarMock {
  public static instance(): Partial<StatusBar> {
    return {
      styleDefault() {
      }
    };
  }
}

describe('App Initializer Provider', () => {

  it('#initializeApp should initialize the app.', fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        AppInitialiserProvider,
        {provide: Platform, useValue: PlatformMock.instance()},
        {provide: SplashScreen, useValue: SplashScreenMock.instance()},
        {provide: StatusBar, useValue: StatusBarMock.instance()}
      ]
    });
    const appInitializerProvider: AppInitialiserProvider = TestBed.inject(AppInitialiserProvider);
    const platform: Platform = TestBed.inject(Platform);
    const statusBar: StatusBar = TestBed.inject(StatusBar);
    const splashScreen: SplashScreen = TestBed.inject(SplashScreen);

    const readySpy: jasmine.Spy = spyOn(platform, 'ready').and.callThrough();
    const styleDefaultSpy: jasmine.Spy = spyOn(statusBar, 'styleDefault');
    const hideSpy: jasmine.Spy = spyOn(splashScreen, 'hide');

    appInitializerProvider.initialiseApp();
    tick();

    expect(readySpy).toHaveBeenCalledTimes(1);
    expect(readySpy).toHaveBeenCalledWith();

    expect(styleDefaultSpy).toHaveBeenCalledTimes(1);
    expect(styleDefaultSpy).toHaveBeenCalledWith();

    expect(hideSpy).toHaveBeenCalledTimes(1);
    expect(readySpy).toHaveBeenCalledWith();
  }));

})
