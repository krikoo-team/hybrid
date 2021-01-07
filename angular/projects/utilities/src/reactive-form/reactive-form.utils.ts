import {ExistingProvider, forwardRef, Injectable} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Injectable()
export class ReactiveFormUtils {

  public static getControlValueAccessorProviders(component: any): ExistingProvider {
    return {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => component)
    };
  }

}
