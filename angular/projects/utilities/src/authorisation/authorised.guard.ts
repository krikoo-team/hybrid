import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

import {FireAuthProvider} from '../fire-auth/fire-auth.provider';

@Injectable()
export class AuthorisedGuard implements CanActivate {

  private readonly SING_IN_PAGE: string = 'sign-in';

  constructor(private fireAuthProvider: FireAuthProvider, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.checkAuthenticated();
  }

  private checkAuthenticated(): Observable<boolean | UrlTree> {
    return this.fireAuthProvider.isAuthenticated().pipe(
      mergeMap((isAuthenticated: boolean) => {
        return of(isAuthenticated ? true : this.router.parseUrl(this.SING_IN_PAGE));
      })
    );
  }

}
