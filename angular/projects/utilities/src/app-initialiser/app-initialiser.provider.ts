import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';

import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

@Injectable()
export class AppInitialiserProvider {

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar) {
  }

  public initialiseApp(): void {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}
