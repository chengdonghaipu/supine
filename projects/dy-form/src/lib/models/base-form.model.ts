import {AbstractControl, FormGroup} from '@angular/forms';
import {FormControlConfig} from './base.model';

export abstract class BaseFormModel<T = any> {
  private _initTask = [];

  actionType: string;

  options: FormControlConfig[];

  protected attachValue;

  protected http: T;

  formGroup: FormGroup;

  get option() {
    return this.options;
  }

  get value() {
    const value = this.formGroup.value;
    return this.filter(value);
  }

  get getRawValue() {
    const value = this.formGroup.getRawValue();
    return this.filter(value);
  }

  protected filter(value) {
    const valid = [];

    this.option.forEach(value1 => {
      if (!value1.invalid) {
        valid.push(value1.controlName);
      }
    });
    const _value: any = {};

    valid.forEach(value1 => _value[value1] = value[value1]);
    // this.
    return _value;
  }

  initHook() {
    this._initTask.forEach(value => {
      const [handle, params] = value;
      if (typeof handle === 'function') {
        handle(...params);
      }
    });
  }

  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params): FormControlConfig[] | void {

  }

  withAttachValue(value): this {
    this.attachValue = value;
    return this;
  }

  withHttp(http: T): this {
    this.http = http;
    return this;
  }

  patchValue(value = this.attachValue, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }) {
    if (value && !this.formGroup) {
      this._initTask.push([this.patchValue.bind(this), [value]]);
    } else {
      value && this.formGroup.patchValue(value, options);
    }
    return this;
  }

  withActionType(type: string): this {
    this.actionType = type;
    return this;
  }

  updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean; }) {
    if (!this.formGroup) {
      return;
    }

    const controls = this.formGroup.controls;
    this._updateValueAndValidity(controls, opts);
  }

  private _updateValueAndValidity(controls: { [key: string]: AbstractControl }, opts?: { onlySelf?: boolean; emitEvent?: boolean; }) {
    for (const x in controls) {
      // @ts-ignore
      if (controls[x].controls) {
        // @ts-ignore
        this._updateValueAndValidity(controls[x].controls, opts);
      } else {
        controls[x].markAsDirty();
        controls[x].updateValueAndValidity(opts);
      }
    }
  }
}

