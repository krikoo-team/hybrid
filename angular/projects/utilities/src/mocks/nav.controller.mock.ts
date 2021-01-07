import {UrlTree} from '@angular/router';
import {NavController} from '@ionic/angular';
import {AnimationOptions, NavigationOptions} from '@ionic/angular/providers/nav-controller';

export class NavControllerMock {

  public static instance(): Partial<NavController> {
    return {
      back(options?: AnimationOptions) {
      },
      navigateRoot(url: string | UrlTree | any[], options?: NavigationOptions): Promise<boolean> {
        return Promise.resolve(true);
      }
    };
  }

}
