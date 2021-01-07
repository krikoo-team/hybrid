import {ActivatedRoute, ActivatedRouteSnapshot, ParamMap} from '@angular/router';

export class ActivatedRouteMock {

  public static instance(): Partial<ActivatedRoute> {
    const paramMap: Partial<ParamMap> = {get: (name: string) => name};
    return {
      snapshot: {
        paramMap: paramMap as ParamMap,
      } as ActivatedRouteSnapshot
    };
  }

}
