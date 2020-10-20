import {BaseModel, ModelPartial} from '@supine/dy-form';

type InputType = 'text' | 'password';

export class InputModelControl<M = any> extends BaseModel<M> {
  /**
   * type 必须要实现 不同的type代表不同的控件
   */
  type = 'INPUT';

  /**
   * 只读 如果为true 表示该控件为只读状态
   */
  readonly = false;

  inputType: InputType = 'text';

  constructor(init?: ModelPartial<InputModelControl>) {
    super();
    this.init(init);
  }
}
