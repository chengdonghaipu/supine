import {Const, ModelPartial} from '@supine/dy-form';
import {ZorroControlModel} from './zorro-control.model';

export class InputNumberControl<M = any> extends ZorroControlModel<M> {
  @Const('INPUT_NUMBER')
  type: string;

  formatter: (value: number | string) => string | number = undefined;

  parser: (value: string) => string | number = undefined;
  // 最大值
  max = Infinity;
  // 最小值
  min = -Infinity;
  // 步长
  step = 1;
  // 精度
  precision: number;

  set placeHolder(value: string) {
    this._placeHolder = value;
  }

  get placeHolder() {
    return this._placeHolder || `请输入${this.label}`;
  }

  constructor(init?: ModelPartial<InputNumberControl>) {
    super();
    this.init(init);
  }
}
