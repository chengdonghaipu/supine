import {BaseModel, FormControlConfig} from './models';
import {Type} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {BaseFormModel} from './models';
import {DyFormComponent} from './dy-form.component';


export abstract class AbstractDyFormRef<T extends BaseFormModel> {
  abstract dyForm: DyFormComponent;

  model: T;

  protected readonly _renderData = new BehaviorSubject<FormControlConfig[]>([]);

  protected allOptions: FormControlConfig[] = [];

  private readonly _optionMap = new Map<string, FormControlConfig>();

  get optionMap(): Map<string, FormControlConfig> {
    return this._optionMap;
  }

  get options(): FormControlConfig[] {
    return this._renderData.value;
  }

  /**
   * 注册模型!
   * @param model
   */
  protected abstract registeredModel(model: FormControlConfig[] | Type<any>): this;

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
}
