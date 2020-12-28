import {ModelPartial} from '../type';
import {AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';

let nextUniqueId = 0;

export abstract class BaseModel<M = any> {
  abstract type: string;

  protected _placeHolder: string;

  protected _order = 1;

  uid = 0;

  name: string;

  defaultValue: any = null;

  validators: ValidatorFn | ValidatorFn[] | null = [];

  asyncValidators: AsyncValidatorFn | AsyncValidatorFn[] | null = [];

  // tooltipText = '';

  labelClass: string[] = [];

  controlClass: string[] = [];

  controlStyle: ModelPartial<CSSStyleDeclaration> = {};

  labelStyle: ModelPartial<CSSStyleDeclaration> = {};

  /**
   * 验证时机
   */
  updateOn: 'change' | 'blur' | 'submit';

  aliasName: string;

  get controlName(): string {
    return this.aliasName || this.name;
  }

  /**
   * 当前控件是否隐藏
   */
  hide = false;

  label: string;

  /**
   * 当前控件是否禁用
   */
  disabled = false;

  /**
   * 当前控件提示信息
   */
  set placeHolder(value: string) {
    this._placeHolder = value;
  }

  get placeHolder() {
    return this._placeHolder;
  }

  /**
   * 当前控件是否必填
   */
  required = false;

  formControl: FormControl | undefined;

  oldControl: this | undefined;

  parent: string;
  /**
   * 该属性 当且仅当不是响应式时有效
   * 控件宽度 默认整行
   */

  initHook: (that: this, context: ModelPartial<M>) => void;

  set order(value: number) {
    this._order = value;
  }

  get order() {
    const isNumber = Object.prototype.toString.call(this._order) === '[object Number]';
    return isNumber && !isNaN(this._order) ? this._order : 1;
  }

  protected constructor() {
    this.uid = ++nextUniqueId;
  }

  protected init?: any = (init: BaseModel) => {
    this.name = this.type + this.uid;
    if (init) {
      for (const initKey in init) {
        if (init.hasOwnProperty(initKey) && initKey !== 'type') {
          this[initKey] = init[initKey];
        }
      }
    }
  };
}

export type FormControlConfig = BaseModel & { [key: string]: any };

export class ModelUpdateHelper {
  private static disabledOrEnabled<M extends BaseModel>(keys: string[] | string, models: M[], enabled: boolean) {
    const modelMap = new Map<string, M>();

    models.forEach(value => modelMap.set(value.name, value));

    const checkModelNotFound = (model: M, key: string) => {
      if (!model) {
        throw Error(`Model ${key} not found`);
      }
    };

    let _keys = [];

    if (typeof keys === 'string') {
      _keys.push(keys);
    } else if (Array.isArray(keys)) {
      _keys = keys;
    }

    _keys.forEach(value => {
      const model = modelMap.get(value);

      checkModelNotFound(model, value);

      model.disabled = !enabled;
    });
  }

  /**
   * 禁用控件
   * 支持批量
   * @param keys
   * @param models
   */
  static disabledByKeys<M extends BaseModel>(keys: string[] | string, models: M[]): void {
    ModelUpdateHelper.disabledOrEnabled(keys, models, false);
  }

  /**
   * 启用控件
   * 支持批量
   * @param keys
   * @param models
   */
  static enabledByKeys<M extends BaseModel>(keys: string[] | string, models: M[]): void {
    ModelUpdateHelper.disabledOrEnabled(keys, models, true);
  }
}
