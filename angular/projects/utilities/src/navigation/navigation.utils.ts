import {ActivatedRoute, ActivatedRouteSnapshot, NavigationExtras, Router} from '@angular/router';

export class NavigationUtils {

  public static getBackHref(router: Router, pagePaths: string | Array<string>, id?: string): string {
    const isArray: boolean = pagePaths instanceof Array;
    let routerUrl: string = router.url.toString();
    if (!isArray) {
      const searchValue: string = this.getDefaultHrefSearchValue(pagePaths as string, id);
      return routerUrl.replace(searchValue, '');
    } else {
      const searchValues: Array<string> = (pagePaths as Array<string>)
        .map((pagePath: string) => this.getDefaultHrefSearchValue(pagePath, id));
      searchValues.forEach((searchValue: string) => routerUrl = routerUrl.replace(searchValue, ''));
      return routerUrl;
    }
  }

  public static getNavigationExtras(activatedRoute: ActivatedRoute): NavigationExtras {
    return {relativeTo: activatedRoute};
  }

  public static getParam(activatedRoute: ActivatedRoute, paramName: string): string {
    let value: string | null = '';

    let currentActivatedRoute: ActivatedRoute | null = activatedRoute;
    while (currentActivatedRoute && !value) {
      value = currentActivatedRoute.snapshot.paramMap.get(paramName);
      currentActivatedRoute = currentActivatedRoute.parent;
    }

    let activatedRouteSnapshot: ActivatedRouteSnapshot | null = activatedRoute.snapshot;
    while (activatedRouteSnapshot && !value) {
      value = activatedRouteSnapshot.paramMap.get(paramName);
      activatedRouteSnapshot = activatedRouteSnapshot.firstChild;
    }

    return value || '';
  }

  public static navigate(activatedRoute: ActivatedRoute, router: Router, command: Array<any>, extras?: NavigationExtras): Promise<boolean> {
    extras = extras || this.getNavigationExtras(activatedRoute);
    return router.navigate(command, extras);
  }

  private static getDefaultHrefSearchValue(path: string, id?: string): string {
    return id ? `/${path}/${id}` : `/${path}`;
  }

}
