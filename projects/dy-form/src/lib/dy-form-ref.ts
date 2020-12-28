import {BaseModel, FormControlConfig} from './models';
import {Type} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {BaseFormModel} from './models';
import {CONTROL_MODEL, DY_FORM_OPTIONS, VALIDATOR_RULE} from './decorator/form-metadata';
import {AbstractDyFormRef} from './base-dy-form-ref';
import {DyFormComponent} from './dy-form.component';
import {universal_valid} from './validator-fn';
import {ControlModelMeta} from './decorator';


export class DyFormRef<T extends BaseFormModel> extends AbstractDyFormRef<T> {
  // 用于销毁资源
  private _unsubscribe$ = new Subject<void>();

  dyForm: DyFormComponent;

  constructor(model: Type<T>) {
    super();
    this.registeredModel(model);
  }

  disconnect(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  protected renderDataNext(options: FormControlConfig[]) {
    this.optionMap.clear();

    options.forEach(value => this.optionMap.set(value.name, value));

    this._renderData.next(options.sort((a, b) => a.order - b.order));
  }

  connect(): Observable<BaseModel[]> {
    return this._renderData;
  }

  // protected disabledByKeys(keys: string[] | string): this {
  //   this._disabledOrEnabled(keys, true);
  //   return this;
  // }
  //
  // protected enabledByKeys(keys: string[] | string): this {
  //   this._disabledOrEnabled(keys, false);
  //   return this;
  // }
  //
  // getControlByName(controlName: string): FormControl {
  //   return undefined;
  // }

  private _registeredModel(model: FormControlConfig[]) {
    const optionMap = new Map<string, FormControlConfig>();

    model.forEach(value => {
      if (optionMap.has(value.name)) {
        throw Error(`${value.name} always exists`);
      }
      optionMap.set(value.name, value);
    });

    this.allOptions = model;
  }

  /**
   * 触发模型modelUpdateHook 从而更新视图
   * @param params 传递给modelUpdateHook的参数 对于复杂场景很有用
   */
  executeModelUpdate(...params: any[]): void {
    const hook = this.model.modelUpdateHook.bind(this.model);

    const formValue = this?.dyForm?.formArea.value || {};

    const options = hook(formValue, this.allOptions/*.map(value => cloneDeep(value))*/, ...params);

    this.renderDataNext(options || this.allOptions);
  }

  /**
   * 解析模型
   * @param Model
   * @param attached
   */
  protected resolveModel<M extends BaseFormModel>(Model: Type<M>, attached = false) {
    if (this.model && !attached) {
      throw Error(`不能注册多个表单模型`);
    }

    const options: FormControlConfig[] = Reflect.getMetadata(DY_FORM_OPTIONS, Model.prototype) || [];

    const controlModel: ControlModelMeta<M> = Reflect.getMetadata(CONTROL_MODEL, Model) || {
      models: [],
      updateOn: null,
    };

    const {models: attachedModels, updateOn} = controlModel;
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
      value.updateOn = value.updateOn ? value.updateOn : (updateOn || 'change');


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

        (value.validators as ValidatorFn[]).push(universal_valid(value.name, rule, msg, property));
      }

      if (typeof value.initHook === 'function') {
        value.initHook.bind(_model)(value, _model);
      }
    });

    this._registeredModel(options);
  }

  /**
   * 注册表单模型
   * @param model 表单模型
   * @return this
   */
  protected registeredModel<M extends BaseFormModel>(model: Type<M>): this {
    if (this.model) {
      throw Error(`不能注册多个表单模型`);
    }

    this.resolveModel(model);

    return this;
  }

  /**
   * 新增表单控件 一般很少用 建议通过模型实现相应的业务
   * @param control 控件模型，可以是数组
   * @param indexOrName 插入指定的索引位置或者控件名称位置 可选
   */
  addControl<C extends BaseModel>(control: C | C[], indexOrName?: number | string): this {
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
   * @param control 控件模型，可以是数组
   */
  updateControl<C extends BaseModel>(control: C | C[]): this {
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
