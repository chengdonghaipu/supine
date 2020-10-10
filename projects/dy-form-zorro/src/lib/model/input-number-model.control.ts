import {BaseModel, ModelPartial} from '@supine/dy-form';

export class InputNumberModelControl<M = any> extends BaseModel<M> {

  type = 'INPUT_NUMBER';

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

  constructor(init?: ModelPartial<InputNumberModelControl>) {
    super();
    this.init(init);
  }
}
