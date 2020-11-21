import {DyFormMode} from './type';
import {BaseModel, FormControlConfig} from './models';
import {Type} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {BaseFormModel} from './models';
import {ControlLayout} from './models/type';


export abstract class AbstractDyFormRef<T extends BaseFormModel> {
  abstract dyForm;

  mode: DyFormMode = 'vertical';

  model: T;

  // customLayout = false;
  //
  // column = 24;

  // gridBreakpoints: ControlLayout & { unit: string } = {
  //   xs: 0,
  //   sm: 576,
  //   md: 768,
  //   lg: 992,
  //   xl: 1200,
  //   xxl: 1600,
  //   unit: 'px'
  // };
  //
  // labelColLayout: ControlLayout = {
  //   xs: '0 0 100%',
  //   sm: '0 0 100%',
  //   md: '0 0 25%',
  //   lg: '0 0 25%',
  //   xl: '0 0 25%',
  //   xxl: '0 0 25%'
  // };

  // verticalLayout = {
  //   labelCol: 6,
  //   controlCol: 16,
  // };

  // private _areaOptions: { [key: number]: FormControlConfig[] } = {};

  protected readonly _renderData = new BehaviorSubject<FormControlConfig[]>([]);

  protected allOptions: FormControlConfig[] = [];
  /**
   * 容器个数
   */
  // containerCount = 1;

/*  get areaOptions() {
    return this._areaOptions;
  }*/

  // get verticalForm() {
  //   return this.mode === 'vertical';
  // }
  //
  // get horizontalForm() {
  //   return this.mode === 'horizontal';
  // }
  //
  // get responsiveForm() {
  //   return false;
  // }

  private readonly _optionMap = new Map<string, FormControlConfig>();

  get optionMap(): Map<string, FormControlConfig> {
    return this._optionMap;
  }

  get options(): FormControlConfig[] {
    return this._renderData.value;
  }

/*  generateAreaOptions(model?: FormControlConfig[]) {
    const options = model || this.options;

    options.forEach(value => {
      if (!this.areaOptions[value.areaId]) {
        this.areaOptions[value.areaId] = [];
      }

      this.areaOptions[value.areaId].push(value);
    });

    const keys = Object.keys(this.areaOptions);

    this.containerCount = keys.length;
  }*/

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
