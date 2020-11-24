import {ModelPartial} from '../type';
import {AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {ControlLayout} from './type';

let nextUniqueId = 0;

export abstract class BaseModel<M = any> {
  abstract type: string;

  protected _placeHolder: string;

  uid = 0;

  name: string;

  /*get uid() {
     return this._uid;
  }*/

  defaultValue: any = null;

  validators: ValidatorFn | ValidatorFn[] | null = [];

  asyncValidators: AsyncValidatorFn | AsyncValidatorFn[] | null = [];

  tooltipText = '';

  labelClass: string[] = [];

  controlClass: string[] = [];

  controlStyle: ModelPartial<CSSStyleDeclaration> = {};

  labelStyle: ModelPartial<CSSStyleDeclaration> = {};

  /**
   * 验证时机
   */
  updateOn: 'change' | 'blur' | 'submit' = 'change';

  /**
   * 当invalid为true 时 该控件会从动态表单中移除(注意: 不是隐藏)
   */
  invalid = false;

  /**
   * 与 invalid 相互配合  如果满足条件  则将 invalid 设置为false 即为有效状态
   */
  // validOfIf: (value: any, context: ModelPartial<M>) => boolean = undefined;

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

  // controlLayout: ControlLayout;

  formControl: FormControl | undefined;

  oldControl: this | undefined;

  parent: string;
  /**
   * 该属性 当且仅当不是响应式时有效
   * 控件宽度 默认整行
   */
  // controlCol: string | number = 24;

  initHook: (that: this, context: ModelPartial<M>) => void;

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
  }
}

export type FormControlConfig = BaseModel & {[key: string]: any};
