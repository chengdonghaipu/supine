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

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
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

