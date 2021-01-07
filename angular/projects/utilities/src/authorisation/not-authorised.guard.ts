import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

import {FireAuthProvider} from '../fire-auth/fire-auth.provider';

@Injectable()
export class NotAuthorisedGuard implements CanActivate {

  private readonly HOME_PAGE: string = 'home';

  constructor(private fireAuthProvider: FireAuthProvider, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.checkAuthenticated();
  }

  private checkAuthenticated(): Observable<boolean | UrlTree> {
    return this.fireAuthProvider.isAuthenticated().pipe(
      mergeMap((isAuthenticated: boolean) => {
        return of(!isAuthenticated ? true : this.router.parseUrl(this.HOME_PAGE));
      })
    );
  }

}
