import {ChangeDetectorRef, Component, DebugElement, OnInit} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {IonicModule} from "@ionic/angular";

import {AbstractControlValueAccessor} from "./AbstractControlValueAccessor";
import {ReactiveFormUtils} from "./reactive-form.utils";

@Component({
  selector: 'custom-input-component',
  template: ``,
  providers: [ReactiveFormUtils.getControlValueAccessorProviders(CustomInputComponent)]
})
class CustomInputComponent extends AbstractControlValueAccessor {
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
}

@Component({
  template: `
    <form [formGroup]="customForm">
      <custom-input-component formControlName="customInput"></custom-input-component>
    </form>
  `
})
class AbstractControlValueAccessorComponentSpec implements OnInit {
  public customForm?: FormGroup;
  public formState?: { value?: string, disabled?: boolean } | string;

  ngOnInit(): void {
    this.customForm = new FormGroup({
      customInput: new FormControl(this.formState)
    });
  }
}

describe('Abstract Control Value Accessor', () => {

  let abstractControlValueAccessorComponentSpec: AbstractControlValueAccessorComponentSpec;
  let abstractControlValueAccessorComponentFixture: ComponentFixture<AbstractControlValueAccessorComponentSpec>;

  const getCustomInputComponent: () => CustomInputComponent = (): CustomInputComponent => {
    abstractControlValueAccessorComponentFixture.detectChanges();
    const customInputComponentDebugElement: DebugElement = abstractControlValueAccessorComponentFixture.debugElement.query(By.directive(CustomInputComponent));
    return customInputComponentDebugElement.componentInstance;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbstractControlValueAccessorComponentSpec, CustomInputComponent],
      imports: [IonicModule, ReactiveFormsModule]
    });

    abstractControlValueAccessorComponentFixture = TestBed.createComponent(AbstractControlValueAccessorComponentSpec);
    abstractControlValueAccessorComponentSpec = abstractControlValueAccessorComponentFixture.componentInstance;
  });

  it('should have a default value.', () => {
    abstractControlValueAccessorComponentSpec.formState = 'foo';
    const customInputComponent: CustomInputComponent = getCustomInputComponent();
    expect(customInputComponent.inputValue).toBe('foo');
  });

  it('should set disabled when it is set as disabled.', () => {
    abstractControlValueAccessorComponentSpec.formState = {value: '', disabled: true};
    const customInputComponent: CustomInputComponent = getCustomInputComponent();
    expect(customInputComponent.inputDisabled).toBe(true);
  });

  it('should prevent set #propagateChange and #propagateTouch.', () => {
    const customInputComponentDebugElement: DebugElement = abstractControlValueAccessorComponentFixture.debugElement.query(By.directive(CustomInputComponent));
    const registerOnChangeSpy: jasmine.Spy = spyOn(customInputComponentDebugElement.componentInstance, 'registerOnChange').and.returnValue(null);
    const registerOnTouchedSpy: jasmine.Spy = spyOn(customInputComponentDebugElement.componentInstance, 'registerOnTouched').and.returnValue(null);

    const customInputComponent: CustomInputComponent = getCustomInputComponent();
    customInputComponent.inputValue = 'newValue';

    expect(registerOnChangeSpy).toHaveBeenCalledTimes(1);
    expect(registerOnTouchedSpy).toHaveBeenCalledTimes(1);
  });

  it('should not propagate changes when value set is the same that previous value.', () => {
    abstractControlValueAccessorComponentSpec.formState = 'foo';

    const customInputComponent: CustomInputComponent = getCustomInputComponent();
    spyOn(customInputComponent, 'registerOnInit').and.returnValue();

    abstractControlValueAccessorComponentSpec.customForm?.get('customInput')?.setValue('foo');

    expect(customInputComponent.registerOnInit).toHaveBeenCalledTimes(0);
  });

});
