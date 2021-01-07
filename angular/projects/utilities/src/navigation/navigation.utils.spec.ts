import {ActivatedRoute, ActivatedRouteSnapshot, NavigationExtras, ParamMap, Router} from '@angular/router';

import {NavigationUtils} from './navigation.utils';

describe('Navigation Utils', () => {

  describe('#getBackHref', () => {

    it('should return the url without pagePath.', () => {
      const router: Router = {url: 'url/pagePath'} as Router;
      const pagePath: string = 'pagePath';
      expect(NavigationUtils.getBackHref(router as Router, pagePath)).toEqual('url');
    });

    it('should return the url without pagePaths of an array.', () => {
      const router: Router = {url: 'url/pagePath'} as Router;
      const pagePaths: Array<string> = ['pagePath', 'otherPath'];
      expect(NavigationUtils.getBackHref(router as Router, pagePaths)).toEqual('url');
    });

    it('should return the url without pagePath nor id.', () => {
      const router: Router = {url: 'url/pagePath/id'} as Router;
      const pagePath: string = 'pagePath';
      const id: string = 'id';
      expect(NavigationUtils.getBackHref(router as Router, pagePath, id)).toEqual('url');
    });

  });

  it('#getNavigationExtras should return NavigationExtras Object.', () => {
    const activatedRoute: ActivatedRoute = {outlet: 'outlet'} as ActivatedRoute;
    const expectedNavigationExtras: NavigationExtras = {relativeTo: activatedRoute} as NavigationExtras;
    expect(NavigationUtils.getNavigationExtras(activatedRoute)).toEqual(expectedNavigationExtras);
  });

  describe('#getParam', () => {

    it('should return the param name.', () => {
      const paramName: string = 'param-name';
      const activatedRoute: ActivatedRoute = {snapshot: {paramMap: {get: (name: string) => name}}} as ActivatedRoute;
      expect(NavigationUtils.getParam(activatedRoute, paramName)).toEqual(paramName);
    });

    it('should return the parent param name.', () => {
      const paramName: string = 'param-name';
      const activatedRoute: ActivatedRoute = {
        parent: {snapshot: {paramMap: {get: (name: string) => name}}},
        snapshot: {paramMap: {get: (name: string) => ''}}
      } as ActivatedRoute;
      expect(NavigationUtils.getParam(activatedRoute, paramName)).toEqual(paramName);
    });

    it('should return the child param name.', () => {
      const paramName: string = 'param-name';
      const activatedRoute: ActivatedRoute = {
        parent: null,
        snapshot: {
          paramMap: {get: (name: string) => ''},
          firstChild: {paramMap: {get: (name: string) => name}}
        }
      } as ActivatedRoute;
      expect(NavigationUtils.getParam(activatedRoute, paramName)).toEqual(paramName);
    });

    it('should an empty result when no param is retrieved.', () => {
      const paramName: string = 'param-name';
      const activatedRoute: ActivatedRoute = {snapshot: {paramMap: {get: (name: string) => ''}}} as ActivatedRoute;
      expect(NavigationUtils.getParam(activatedRoute, paramName)).toBe('');
    });

  });

  describe('#navigate', () => {

    it('#navigate should emit navigate of Router without extras.', () => {
      const activatedRoute: ActivatedRoute = {outlet: 'outlet'} as ActivatedRoute;
      const expectedNavigationExtras: NavigationExtras = {relativeTo: activatedRoute} as NavigationExtras;
      const router: Router = {
        url: 'url/pagePath',
        navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
          return Promise.resolve(true);
        }
      } as Router;
      const command: Array<any> = ['pagePath', 'otherPath'];
      const navigateSpy: jasmine.Spy = spyOn(router, 'navigate');
      NavigationUtils.navigate(activatedRoute, router, command);
      expect(navigateSpy).toHaveBeenCalledWith(command, expectedNavigationExtras);
    });

    it('#navigate should emit navigate of Router with extras.', () => {
      const activatedRoute: ActivatedRoute = {outlet: 'outlet'} as ActivatedRoute;
      const navigationExtras: NavigationExtras = {relativeTo: activatedRoute} as NavigationExtras;
      const router: Router = {
        url: 'url/pagePath',
        navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
          return Promise.resolve(true);
        }
      } as Router;
      const command: Array<any> = ['pagePath', 'otherPath'];
      const navigateSpy: jasmine.Spy = spyOn(router, 'navigate');
      NavigationUtils.navigate(activatedRoute, router, command, navigationExtras);
      expect(navigateSpy).toHaveBeenCalledWith(command, navigationExtras);
    });

  });

});
