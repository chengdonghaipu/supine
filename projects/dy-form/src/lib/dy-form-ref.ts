import {BaseModel, FormControlConfig} from './models';
import {Type} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {BaseFormModel} from './models';
import {ControlLayout} from './models/type';
import {ATTACHED_MODEL, DY_FORM_OPTIONS, VALIDATOR_RULE} from './decorator/form-metadata';
import {AbstractDyFormRef} from './base-dy-form-ref';
import {DyFormComponent} from './dy-form.component';
import {universal_valid} from './validator-fn';


export interface DyFormRefInitialData {
  // column?: number;

  // controlLayout?: ControlLayout;
  //
  // gridBreakpoints?: ControlLayout & { unit: string };

  // customLayout?: boolean;

  // verticalLayout?: {
  //   labelCol: number,
  //   controlCol: number,
  // };
}

export class DyFormRef<T extends BaseFormModel> extends AbstractDyFormRef<T> {
  // 用于销毁资源
  private _unsubscribe$ = new Subject<void>();

  dyForm: DyFormComponent;

  // protected modelSet = new Map<Type<any>, FormControlConfig[]>();
  /**
   * 默认所有控件都按照这个配置进行响应式变化
   */
  // controlLayout: ControlLayout = {
  //   xs: this.column,
  //   sm: this.column / 2,
  //   md: this.column / 2,
  //   lg: this.column / 3,
  //   xl: this.column / 4,
  //   xxl: this.column / 4
  // };

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

  constructor(model: Type<T>, initialData: DyFormRefInitialData = {}) {
    super();
    this.registeredModel(model);

    for (const initialDataKey in initialData) {
      if (initialData.hasOwnProperty(initialDataKey)) {
        this[initialDataKey] = initialData[initialDataKey];
      }
    }
  }

  disconnect(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  renderDataNext(options: FormControlConfig[]) {
    this.optionMap.clear();

    options.forEach(value => this.optionMap.set(value.name, value));

    this._renderData.next(options);
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
    const optionMap = new Map<string, FormControlConfig>();

    model.forEach(value => {
      if (optionMap.has(value.name)) {
        throw Error(`${value.name} always exists`);
      }
      optionMap.set(value.name, value);
      // if (!value.controlLayout) {
      //   value.controlLayout = this.controlLayout;
      // }
    });

    this.allOptions = model;

    // this.generateAreaOptions(model);
    // this.renderDataNext(model);
  }

  executeModelUpdate(...params: any[]) {
    const hook = this.model.modelUpdateHook.bind(this.model);

    const formValue = this?.dyForm?.formArea.value || {};

    const options = hook(formValue, this.allOptions, ...params);

    // console.log((options || this.allOptions).length);

    // this.generateAreaOptions(options || this.allOptions);
    this.renderDataNext(options || this.allOptions);
  }

  /**
   * 解析模型
   * @param Model
   * @param attached
   */
  resolveModel<M extends BaseFormModel>(Model: Type<M>, attached = false) {
    if (this.model && !attached) {
      throw Error(`不能注册多个表单模型`);
    }

    const options: FormControlConfig[] = Reflect.getMetadata(DY_FORM_OPTIONS, Model.prototype);

    const attachedModels = Reflect.getMetadata(ATTACHED_MODEL, Model) as Type<M>[] || [];
    // 递归注册附加模型
    attachedModels.forEach(value => {
      const tempOptions = this.resolveModel(value, true);
      options.push(...tempOptions);
    });

    if (attached) {
      return options;
    }

    const _model = new Model();

    this.model = _model as unknown as T;

    if (!options) {
      throw Error(`Parameter ${Model} is invalid`);
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

      const ruleObj = Reflect.getMetadata(VALIDATOR_RULE, _model, value.name);

      if (ruleObj) {
        // tslint:disable-next-line:prefer-const
        let {rule, msg, property} = ruleObj;

       /* if (Array.isArray(rule)) {
          rule = rule.join('&');
        }

        value.required = /required/.test(rule);*/

        (value.validators as ValidatorFn[]).push(universal_valid(value.name, rule, msg, property));
      }

      if (typeof value.initHook === 'function') {
        value.initHook.bind(_model)(value, _model);
      }
    });

    this._registeredModel(options);
  }

  registeredModel<M extends BaseFormModel>(model: Type<M>): this {
    if (this.model) {
      throw Error(`不能注册多个表单模型`);
    }

    this.resolveModel(model);

    return this;
  }

  /**
   * 新增表单控件 一般很少用 建议通过模型实现相应的业务
   * @param control
   * @param indexOrName
   */
  addControl(control: BaseModel | BaseModel[], indexOrName?: number | string): this {
    control = !Array.isArray(control) ? [control] : control;

    for (const ol of control) {
      if (this.optionMap.has(ol.name)) {
        throw Error(`${ol.name} always exists`);
      }
    }

    let index: number;

    if (typeof indexOrName === 'string') {
      index = this.options.findIndex(value => value.name === indexOrName);
    } else {
      index = indexOrName;
    }

    if (indexOrName && index < 0) {
      throw Error(`${indexOrName} not exit`);
    }

    const option = this.options;

    control.forEach(value => {
      // if (!value.controlLayout) {
      //   value.controlLayout = this.controlLayout;
      // }
      value.oldControl = undefined;
    });

    if (indexOrName && index > -1) {
      option.splice(index, 0, ...control);
    }

    if (!indexOrName) {
      option.push(...control);
    }

    // this.generateAreaOptions(option);
    this.renderDataNext(option);

    return this;
  }

  /**
   * 移除所有表单控件 一般很少用 建议通过模型实现相应的业务
   */
  removeAllControl(): this {
    const newData = [];
    this.renderDataNext(newData);
    return this;
  }

  /**
   * 移除表单控件 一般很少用 建议通过模型实现相应的业务
   * @param controlName
   */
  removeControl(controlName: string | string[]): this {
    controlName = !Array.isArray(controlName) ? [controlName] : controlName;

    let remove = false;
    const option = this.options.filter(value => {
      if (controlName.includes(value.name)) {
        remove = true;
        // this._optionMap.delete(value.name);
        return false;
      }
      return true;
    });

    if (!remove) {
      return this;
    }

    this.renderDataNext(option);

    return this;
  }

  /**
   * 重置表单
   * @param value
   * @param options
   */
  reset(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean }) {
    this.dyForm.reset(value, options);
  }

  /**
   * 填充表单数据
   * @param value
   * @param options
   */
  setValues(value: { [p: string]: any }, options?: { onlySelf?: boolean; emitEvent?: boolean }): this {
    this.dyForm.setValues(value, options);
    return this;
  }

  /**
   * 更新表单控件 一般很少用 建议通过模型实现相应的业务
   * @param control
   */
  updateControl(control: BaseModel | BaseModel[]): this {
    control = !Array.isArray(control) ? [control] : control;

    let update = false;
    // tslint:disable-next-line:one-variable-per-declaration
    const nameMap: { [key: string]: number } = {},
      controlName: string[] = control.map((value, index) => {
        nameMap[value.name] = index;
        return value.name;
      }),
      option = this.options.map(value => {
        if (controlName.includes(value.name)) {
          // value.oldControl = { ...value } as any;
          // delete control[nameMap[value.name]].oldControl;
          const mergeOptions = Object.assign(value, control[nameMap[value.name]]);
          // this._optionMap.set(value.name, mergeOptions);
          update = true;
          return mergeOptions;
        }
        return value;
      });
    if (!update) {
      return this;
    }

    // this.generateAreaOptions(option);
    this.renderDataNext(option);

    return this;
  }
}
