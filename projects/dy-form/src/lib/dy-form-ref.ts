import {DyFormMode} from './type';
import {BaseModel, FormControlConfig} from './models';
import {Type} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {BaseFormModel} from './models';
import {ControlLayout} from './models/type';
import {DY_FORM_OPTIONS} from './decorator/form-metadata';


export abstract class AbstractDyFormRef<T extends BaseFormModel> {
  mode: DyFormMode = 'vertical';

  model: T;

  column = 24;

  customLayout = false;

  gridBreakpoints: ControlLayout & { unit: string } = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
    unit: 'px'
  };

  private _areaOptions: { [key: number]: FormControlConfig[] } = {};

  protected readonly _renderData = new BehaviorSubject<FormControlConfig[]>([]);

  /**
   * 容器个数
   */
  containerCount = 1;

  get containerArr() {
    const arr = [];
    for (let i = 0; i < this.containerCount; i++) {
      arr.push(i);
    }
    return arr;
  }

  get areaOptions() {
    return this._areaOptions;
  }

  get verticalForm() {
    return this.mode === 'vertical';
  }

  get horizontalForm() {
    return this.mode === 'horizontal';
  }

  get responsiveForm() {
    return this.mode === 'responsive';
  }

  private readonly _optionMap = new Map<string, FormControlConfig>();

  get optionMap(): Map<string, FormControlConfig> {
    return this._optionMap;
  }

  get options(): FormControlConfig[] {
    return this._renderData.value || [];
  }

  generateAreaOptions(model?: FormControlConfig[]) {
    const options = model || this.options;

    options.forEach(value => {
      if (!this.areaOptions[value.areaId]) {
        this.areaOptions[value.areaId] = [];
      }

      this.areaOptions[value.areaId].push(value);
    });

    const keys = Object.keys(this.areaOptions);

    this.containerCount = keys.length;
  }

  /**
   * 注册模型!
   * @param model
   */
  abstract registeredModel(model: FormControlConfig[] | Type<any>): this;

  /**
   * 添加控件
   * 支持批量增加
   * @param control 配置
   * @param indexOrName 指定位置加入
   */
  abstract addControl(control: BaseModel | BaseModel[], indexOrName?: number | string): this;

  /**
   * 移除控件
   * 支持批量移除
   * @param controlName
   */
  abstract removeControl(controlName: string | string[]): this;

  /**
   * 移除所有控件
   */
  abstract removeAllControl(): this;

  /**
   * 更新控件
   * 支持批量更新
   * @param control
   */
  abstract updateControl(control: BaseModel | BaseModel[]): this;

  /**
   * 获取控件实例
   * @param controlName
   */
  abstract getControlByName(controlName: string): FormControl;

  abstract connect(): Observable<BaseModel[]>;

  /**
   * 释放资源
   */
  abstract disconnect(): void;

  abstract setValues(
    value: { [key: string]: any; },
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): this;

  abstract reset(value?: any, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  });

  /**
   * 禁用控件
   * 支持批量
   * @param keys
   */
  abstract disabledByKeys(keys: string[] | string): this;

  /**
   * 启用控件
   * 支持批量
   * @param keys
   */
  abstract enabledByKeys(keys: string[] | string): this;
}

interface InitialData {
  mode?: DyFormMode;

  column?: number;

  controlLayout?: ControlLayout;
  //
  gridBreakpoints?: ControlLayout & { unit: string };

  customLayout?: boolean;
}

export class DyFormRef<T extends BaseFormModel> extends AbstractDyFormRef<T> {
  // 用于销毁资源
  private _unsubscribe$ = new Subject<void>();

  /**
   * 默认所有控件都按照这个配置进行响应式变化
   */
  controlLayout: ControlLayout = {
    xs: this.column,
    sm: this.column / 2,
    md: this.column / 2,
    lg: this.column / 3,
    xl: this.column / 4,
    xxl: this.column / 4
  };

  private _disabledOrEnabled(keys: string[] | string, enabled: boolean) {
    const _updateField = [];
    if (Array.isArray(keys)) {
      keys.forEach(value1 => {
        _updateField.push({name: value1, disabled: enabled});
      });
    } else if (typeof keys === 'string') {
      _updateField.push({name: keys, disabled: enabled});
    }
    this.updateControl(_updateField);
  }

  constructor(models: FormControlConfig[] | Type<T> = [], initialData: InitialData = {}) {
    super();
    this.registeredModel(models);

    for (const initialDataKey in initialData) {
      if (initialData.hasOwnProperty(initialDataKey)) {
        this[initialDataKey] = initialData[initialDataKey];
      }
    }
  }

  addControl(control: BaseModel | BaseModel[], indexOrName?: number | string): this {
    return undefined;
  }

  disconnect(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  connect(): Observable<BaseModel[]> {
    return this._renderData;
  }

  disabledByKeys(keys: string[] | string): this {
    this._disabledOrEnabled(keys, true);
    return this;
  }

  enabledByKeys(keys: string[] | string): this {
    this._disabledOrEnabled(keys, false);
    return this;
  }

  getControlByName(controlName: string): FormControl {
    return undefined;
  }

  private _registeredModel(model: FormControlConfig[]) {
    model.forEach(value => {
      if (this.optionMap.has(value.name)) {
        throw Error(`${value.name} always exists`);
      }
      this.optionMap.set(value.name, value);
      if (!value.controlLayout) {
        value.controlLayout = this.controlLayout;
      }
    });


    // this.option = model;
    // this._renderData.next(model);

    // Promise.resolve().then(() => this._renderData.next(model));
    // this.model.whitelist(null, model, this.whitelistChange);
    // TODO 会触发两次
    setTimeout(() => {
      // this.model.whitelist(null, model, this.whitelistChange);
    });
    this.generateAreaOptions(model);
    this._renderData.next(model);
  }

  registeredModel(model: FormControlConfig[] | Type<any>): this {
    if (Array.isArray(model)) {
      this._registeredModel(model);
      return this;
    }

    if (typeof model === 'function') {
      const _model = new (model as Type<T>)();

      this.model = _model;

      Promise.resolve().then(() => {
        const options: FormControlConfig[] = Reflect.getMetadata(DY_FORM_OPTIONS, model.prototype);
        if (!options) {
          throw Error(`Parameter ${model} is invalid`);
        }
        _model.options = options;

        options.forEach(value => {
          const formOptionValue = _model[value.name];
          value.validators = [];
          value.asyncValidators = [];

          if (formOptionValue) {
            if (!Array.isArray(formOptionValue)) {
              throw new Error(`控件赋值错误: eg:
              export class MineralModel {
                  @InputModel({label: '矿岩名称'})
                  mineralName = [null, [Validators.required]];
              }`);
            }
            const [state, validators, asyncValidators] = formOptionValue;

            value.defaultValue = state;

            if (Array.isArray(validators)) {
              (value.validators as ValidatorFn[]).push(...validators);
            }

            if (Array.isArray(asyncValidators)) {
              (value.asyncValidators as AsyncValidatorFn[]).push(...asyncValidators);
            }
          }

          /*const ruleObj = Reflect.getMetadata(VALIDATOR_RULE, _model, value.name);

          if (ruleObj) {
            // tslint:disable-next-line:prefer-const
            let { rule, msg } = ruleObj;

            if (Array.isArray(rule)) {
              rule = rule.join('&');
            }

            value.required = /required/.test(rule);

            (value.validators as ValidatorFn[]).push(universal_valid(value.name, rule, msg));
          }*/

          if (typeof value.initHook === 'function') {
            value.initHook.bind(_model)(value, _model);
          }
        });

        this._registeredModel(options);
      });
    }

    return this;
  }

  removeAllControl(): this {
    return undefined;
  }

  removeControl(controlName: string | string[]): this {
    return undefined;
  }

  reset(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean }) {
  }

  setValues(value: { [p: string]: any }, options?: { onlySelf?: boolean; emitEvent?: boolean }): this {
    return undefined;
  }

  updateControl(control: BaseModel | BaseModel[]): this {
    return undefined;
  }
}
