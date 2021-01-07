import {NgModule} from '@angular/core';

import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';

import {AppInitialiserProvider} from './app-initialiser.provider';

@NgModule({
  providers: [
    AppInitialiserProvider,
    StatusBar,
    SplashScreen
  ]
})
export class AppInitialiserModule {
}
