import {ControlValueAccessor} from '@angular/forms';
import {ChangeDetectorRef} from '@angular/core';

export abstract class AbstractControlValueAccessor implements ControlValueAccessor {

  private disabled: any;
  private value: any;
  private onChange: (value: any) => void = () => {
  }

  private onTouched: () => void = () => {
  }

  public constructor(private sourceChangeDetectorRef: ChangeDetectorRef) {
  }

  public get inputDisabled(): any {
    return this.disabled;
  }

  public set inputDisabled(value: any) {
    this.disabled = value;
  }

  public get inputValue(): any {
    return this.value;
  }

  public set inputValue(value: any) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.sourceChangeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnInit(obj: any) {
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.inputDisabled = isDisabled;
  }

  writeValue(value: any): void {
    if (value !== this.inputValue) {
      this.inputValue = value;
      this.registerOnInit(value);
    }
  }

}
