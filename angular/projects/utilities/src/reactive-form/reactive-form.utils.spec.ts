import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {forwardRef} from '@angular/core';

import {ReactiveFormUtils} from './reactive-form.utils';

describe('Reactive Form Utils', () => {

  it('should return an existing provider.', () => {
    const existingProvider = {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => 'component')
    };
    spyOn(ReactiveFormUtils, 'getControlValueAccessorProviders').and.returnValue(existingProvider);

    expect(ReactiveFormUtils.getControlValueAccessorProviders('component')).toEqual(existingProvider);
  });

});
