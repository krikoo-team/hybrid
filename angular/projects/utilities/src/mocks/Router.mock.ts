import {NavigationExtras, Router} from '@angular/router';

export class RouterMock {

  public static instance(): Partial<Router> {
    return {
      navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
        return null as any;
      }
    };
  }

}
